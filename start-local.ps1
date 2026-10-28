$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$mysqlRoot = Join-Path $env:LOCALAPPDATA 'Programs\MySQL\mysql-8.4.9-winx64'
$mysqlExecutable = Join-Path $mysqlRoot 'bin\mysqld.exe'
$dataDirectory = Join-Path $env:LOCALAPPDATA 'EssenciaOrganizada\mysql-data'
$mysqlErrorLog = Join-Path $dataDirectory "$($env:COMPUTERNAME).err"

foreach ($key in @('DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET', 'API_PORT', 'PORT')) {
  if ([string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($key, 'Process'))) {
    $value = [Environment]::GetEnvironmentVariable($key, 'User')
    if (-not [string]::IsNullOrWhiteSpace($value)) {
      Set-Item -Path "Env:$key" -Value $value
    }
  }
}

if (-not (Test-Path $mysqlExecutable)) {
  throw "MySQL was not found at $mysqlExecutable."
}
if (-not (Test-Path $dataDirectory)) {
  throw "The persistent MySQL data directory was not found at $dataDirectory. No new database was created."
}
if ([string]::IsNullOrWhiteSpace($env:DB_PASSWORD)) {
  throw 'DB_PASSWORD is missing. Set it in the Windows user environment, then run this script again.'
}

$writeProbe = Join-Path $dataDirectory ".mysql-start-probe-$PID.tmp"
try {
  [System.IO.File]::WriteAllText($writeProbe, 'ok')
  Remove-Item -LiteralPath $writeProbe -Force -ErrorAction SilentlyContinue
} catch {
  throw "The MySQL data directory is not writable: $dataDirectory. Grant the current Windows user Modify permission, then retry. Original error: $($_.Exception.Message)"
}

function Get-Listener([int] $port) {
  @(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
}

function Test-ApiHealth([int] $port) {
  try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:$port/api/health" -TimeoutSec 2
    return $health.status -eq 'ok' -and $health.database -eq 'connected'
  } catch {
    return $false
  }
}

if ((Get-Listener 3306).Count -eq 0) {
  Start-Process -FilePath $mysqlExecutable -ArgumentList @(
    '--no-defaults',
    "--basedir=$mysqlRoot",
    "--datadir=$dataDirectory",
    '--bind-address=127.0.0.1',
    '--port=3306',
    '--mysqlx=0',
    "--log-error=$mysqlErrorLog",
    "--log-bin=$(Join-Path $dataDirectory 'binlog')"
  ) -WorkingDirectory $projectRoot

  $databaseReady = $false
  for ($attempt = 0; $attempt -lt 40; $attempt++) {
    Start-Sleep -Seconds 1
    if ((Get-Listener 3306).Count -gt 0) {
      $databaseReady = $true
      break
    }
  }
  if (-not $databaseReady) {
    $errorTail = if (Test-Path $mysqlErrorLog) {
      (Get-Content -LiteralPath $mysqlErrorLog -Tail 12) -join [Environment]::NewLine
    } else {
      'The MySQL error log was not created.'
    }
    throw "MySQL did not start on 127.0.0.1:3306. Last log entries:`n$errorTail"
  }
  Write-Host 'MySQL started using the existing persistent data directory.'
} else {
  Write-Host 'MySQL is already running on port 3306; it was not started a second time.'
}

$apiPort = if ([string]::IsNullOrWhiteSpace($env:API_PORT)) { 3001 } else { [int]$env:API_PORT }
if (-not (Test-ApiHealth $apiPort)) {
  if ((Get-Listener $apiPort).Count -gt 0) {
    throw "Port $apiPort is occupied, but the API health check failed. No second API was started."
  }

  $nodeExecutable = (Get-Command node.exe -ErrorAction Stop).Source
  Start-Process -FilePath $nodeExecutable -ArgumentList @('--watch', 'server/index.js') -WorkingDirectory $projectRoot

  $apiReady = $false
  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Seconds 1
    if (Test-ApiHealth $apiPort) {
      $apiReady = $true
      break
    }
  }
  if (-not $apiReady) {
    throw "The API did not become healthy on port $apiPort. Check the API window for its explicit startup error."
  }
  Write-Host "API started and connected to MySQL on port $apiPort."
} else {
  Write-Host "API is already healthy on port $apiPort."
}

$vitePort = if ([string]::IsNullOrWhiteSpace($env:PORT)) { 8443 } else { [int]$env:PORT }
$siteUri = "http://127.0.0.1:$vitePort/"
$siteReady = $false
try {
  $siteReady = (Invoke-WebRequest -Uri $siteUri -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200
} catch {
  $siteReady = $false
}

if (-not $siteReady) {
  if ((Get-Listener $vitePort).Count -gt 0) {
    throw "Port $vitePort is occupied, but the site did not respond. No second Vite server was started."
  }

  $viteEntry = Join-Path $projectRoot 'node_modules\vite\bin\vite.js'
  if (-not (Test-Path $viteEntry)) {
    throw 'Vite dependencies are not installed. Run npm install before starting the site.'
  }
  $nodeExecutable = (Get-Command node.exe -ErrorAction Stop).Source
  Start-Process -FilePath $nodeExecutable -ArgumentList @($viteEntry) -WorkingDirectory $projectRoot

  $siteReady = $false
  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Seconds 1
    try {
      $siteReady = (Invoke-WebRequest -Uri $siteUri -UseBasicParsing -TimeoutSec 2).StatusCode -eq 200
    } catch {
      $siteReady = $false
    }
    if ($siteReady) { break }
  }
  if (-not $siteReady) {
    throw "The site did not become available on port $vitePort. Check the Vite window."
  }
  Write-Host "Vite started on port $vitePort."
} else {
  Write-Host "The site is already responding on port $vitePort."
}

Write-Host "Ready: $siteUri"

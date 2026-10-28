# Essência Organizada

## API e MySQL locais

O MySQL 8.4 portátil está instalado em `%LOCALAPPDATA%\Programs\MySQL\mysql-8.4.9-winx64`, com os dados em `%LOCALAPPDATA%\EssenciaOrganizada\mysql-data`. Ele escuta somente em `127.0.0.1:3306`; não foi instalado como serviço do Windows. O banco `essencia_organizada` e as tabelas `users` e `ads` já foram criados. A API cria `ad_requests` na inicialização e, por isso, a conta MySQL configurada para a aplicação precisa da permissão `CREATE`. Alternativamente, aplique `server/migrations/001_ad_requests.sql` com uma conta administrativa antes de iniciar a API. Em instalações novas, `server/schema.sql` já inclui essa tabela. As credenciais da aplicação são variáveis de ambiente do usuário Windows, não ficam neste repositório.

Os dados ficam no diretório persistente acima; fechar o VS Code ou parar o MySQL não apaga os usuários. O MySQL portátil não está registrado como serviço do Windows, então ele para quando o computador é desligado. Para iniciar tudo novamente após abrir o projeto, execute no PowerShell, a partir desta pasta:

```powershell
npm run dev:local
```

O script reutiliza o diretório de dados existente, carrega as credenciais salvas no ambiente do usuário Windows, não inicia outra instância se MySQL/API/site já estiverem ativos e aguarda a API confirmar a conexão com o banco. Se uma configuração obrigatória estiver ausente, a API falha com uma mensagem explícita em vez de tentar conectar como `root` sem senha. O site fica em `http://localhost:8443/` (ou na porta definida por `PORT`), a API em `http://localhost:3001` (ou em `API_PORT`) e o Vite encaminha `/api` e `/uploads` para ela.

As senhas e `JWT_SECRET` devem continuar em `.env` ou no ambiente do usuário Windows; não coloque segredos no Git. A chave `JWT_SECRET` precisa permanecer igual entre reinicializações. O cadastro grava no MySQL com bcrypt, e o login compara a senha com o hash salvo. A criação das tabelas é idempotente (`CREATE TABLE IF NOT EXISTS`) e não apaga os dados.

O site sempre abre deslogado: tokens antigos são descartados ao iniciar o app e novos tokens ficam apenas na sessão atual do navegador. Para uma instalação nova, copie `.env.example` para `.env`, preencha `DB_PASSWORD` e `JWT_SECRET` e aplique `server/schema.sql` a um MySQL 8.0.16 ou superior.

Para uma instalação nova, copie `.env.example` para `.env`, preencha `DB_PASSWORD` e `JWT_SECRET` e aplique `server/schema.sql` a um MySQL 8.0.16 ou superior.

### Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `GET /api/ads` e `GET /api/ads/:id`
- `POST /api/requests` para registrar interesse ou proposta de troca com status `PENDENTE` (autenticado)
- `GET /api/requests/mine` para consultar solicitações enviadas ou recebidas (autenticado)
- `GET /api/ads/mine` (Bearer token)
- `POST /api/ads`, `PATCH /api/ads/:id`, `PUT /api/ads/:id` e `DELETE /api/ads/:id` (Bearer token)
- `GET /api/health`

import { useId, useState } from "react"
import { T, ff, type Page } from "../tokens"
import { Btn, Card, Field, Alert, H3 } from "../components/ui"
import { Icons } from "../components/icons"
import { apiRequest, setAuthToken, type ApiUser } from "../lib/api"

function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        background: `linear-gradient(160deg, ${T.lilacFaint} 0%, ${T.white} 60%)`,
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: T.purple,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
            }}
          >
            <Icons.Home size={24} color="#fff" />
          </div>
          <H3 style={{ fontSize: 22, marginBottom: 6 }}>{title}</H3>
          <p style={{ color: T.muted, fontSize: 14, fontFamily: ff.body }}>
            {subtitle}
          </p>
        </div>
        <Card style={{ padding: 32 }}>{children}</Card>
        {footer && <div style={{ marginTop: 20 }}>{footer}</div>}
      </div>
    </div>
  )
}

function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  minLength,
  visible,
  onToggle,
}: {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minLength?: number
  visible?: boolean
  onToggle?: () => void
}) {
  const inputId = useId()
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        htmlFor={inputId}
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: T.text,
          fontFamily: ff.body,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={inputId}
          type={type === "password" && visible ? "text" : type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required
          minLength={minLength}
          autoComplete={
            type === "password"
              ? "current-password"
              : type === "email"
                ? "email"
                : "name"
          }
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "11px 14px",
            paddingRight: onToggle ? 76 : 14,
            borderRadius: 10,
            border: `1.5px solid ${T.borderMid}`,
            fontSize: 14,
            color: T.text,
            outline: "none",
            fontFamily: ff.body,
          }}
        />
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              border: 0,
              background: "transparent",
              color: T.purple,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {visible ? "Ocultar" : "Mostrar"}
          </button>
        )}
      </div>
    </div>
  )
}

export function LoginPage({
  nav,
  onLogin,
}: {
  nav: (p: Page) => void
  onLogin?: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
    setError("")
    setIsSubmitting(true)
    try {
      const result = await apiRequest<{ token: string; user: ApiUser }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
      )
      setAuthToken(result.token)
      if (onLogin) onLogin()
      else nav("dashboard")
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível entrar.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Bem-vinda de volta"
      subtitle="Entre na sua conta para continuar"
      footer={
        <p
          style={{
            textAlign: "center",
            color: T.muted,
            fontSize: 14,
            fontFamily: ff.body,
          }}
        >
          Não tem uma conta?{" "}
          <button
            onClick={() => nav("cadastro")}
            style={{
              background: "none",
              border: "none",
              color: T.purple,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: ff.body,
              fontSize: 14,
            }}
          >
            Cadastre-se
          </button>
        </p>
      }
    >
      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", gap: 18 }}
      >
        <AuthInput
          label="E-mail"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="seu@email.com"
        />
        <AuthInput
          label="Senha"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Sua senha"
          minLength={8}
          visible={visible}
          onToggle={() => setVisible((value) => !value)}
        />
        {error && <Alert type="error">{error}</Alert>}
        <Btn full size="lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Btn>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => nav("recuperar-senha")}
            style={{
              background: "none",
              border: "none",
              color: T.purple,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: ff.body,
            }}
          >
            Esqueci minha senha
          </button>
        </div>
      </form>
    </AuthShell>
  )
}

export function CadastroPage({
  nav,
  onRegister,
}: {
  nav: (p: Page) => void
  onRegister?: () => void
}) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [visible, setVisible] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const continueRegistration = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setError("Informe seu nome e um e-mail válido para continuar.")
      return
    }
    setError("")
    setStep(2)
  }

  const finishRegistration = async () => {
    if (password.length < 8)
      return setError("A senha precisa ter pelo menos 8 caracteres.")
    if (password !== confirmPassword)
      return setError("As senhas informadas não coincidem.")
    if (!termsAccepted)
      return setError("Aceite os termos para concluir o cadastro.")
    setError("")
    setIsSubmitting(true)
    try {
      const result = await apiRequest<{ token: string; user: ApiUser }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            password,
            city: "Blumenau",
            state: "Santa Catarina",
          }),
        },
      )
      setAuthToken(result.token)
      if (onRegister) onRegister()
      else nav("dashboard")
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível criar a conta.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <AuthShell
      title="Criar sua conta"
      subtitle="Comece sua jornada de organização consciente"
      footer={
        <p
          style={{
            textAlign: "center",
            color: T.muted,
            fontSize: 14,
            fontFamily: ff.body,
          }}
        >
          Já tem uma conta?{" "}
          <button
            onClick={() => nav("login")}
            style={{
              background: "none",
              border: "none",
              color: T.purple,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: ff.body,
              fontSize: 14,
            }}
          >
            Entrar
          </button>
        </p>
      }
    >
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {[1, 2].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: step >= s ? T.purple : T.lilacLight,
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
        <p style={{ fontSize: 12, color: T.muted, fontFamily: ff.body }}>
          Passo {step} de 2
        </p>
      </div>

      {step === 1 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AuthInput
            label="Nome completo"
            value={name}
            onChange={setName}
            placeholder="Ana Beatriz Hoffmann"
          />
          <AuthInput
            label="E-mail"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="seu@email.com"
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="Cidade">
              <div>
                <select
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 10,
                    border: `1.5px solid ${T.borderMid}`,
                    fontSize: 14,
                    fontFamily: ff.body,
                    outline: "none",
                    background: T.white,
                    color: T.text,
                    boxSizing: "border-box",
                  }}
                >
                  <option>Blumenau</option>
                </select>
              </div>
            </Field>
            <Field label="Estado">
              <select
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: `1.5px solid ${T.borderMid}`,
                  fontSize: 14,
                  fontFamily: ff.body,
                  outline: "none",
                  background: T.white,
                  color: T.text,
                  boxSizing: "border-box",
                }}
              >
                <option>Santa Catarina</option>
              </select>
            </Field>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: -8,
              padding: "8px 12px",
              borderRadius: 8,
              background: T.warningBg,
              border: `1px solid #FDE68A`,
            }}
          >
            <Icons.AlertCircle size={14} color={T.warning} />
            <p style={{ fontSize: 12, color: "#92400E", fontFamily: ff.body }}>
              Serviço exclusivo para Blumenau, Santa Catarina.
            </p>
          </div>
          {error && <Alert type="error">{error}</Alert>}
          <Btn full size="lg" onClick={continueRegistration}>
            Continuar
          </Btn>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AuthInput
            label="Senha"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Mínimo 8 caracteres"
            minLength={8}
            visible={visible}
            onToggle={() => setVisible((value) => !value)}
          />
          <AuthInput
            label="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Repita a senha"
            minLength={8}
            visible={visible}
            onToggle={() => setVisible((value) => !value)}
          />
          <p style={{ fontSize: 12, color: T.muted, fontFamily: ff.body }}>
            Use pelo menos 8 caracteres.
          </p>
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              style={{
                marginTop: 2,
                accentColor: T.purple,
                width: 15,
                height: 15,
              }}
            />
            <span
              style={{
                fontSize: 13,
                color: T.muted,
                lineHeight: 1.5,
                fontFamily: ff.body,
              }}
            >
              Concordo com os{" "}
              <span style={{ color: T.purple, fontWeight: 600 }}>
                Termos de uso
              </span>{" "}
              e a{" "}
              <span style={{ color: T.purple, fontWeight: 600 }}>
                Politica de privacidade
              </span>
              .
            </span>
          </label>
          {error && <Alert type="error">{error}</Alert>}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="outline" full onClick={() => setStep(1)}>
              Voltar
            </Btn>
            <Btn full disabled={isSubmitting} onClick={finishRegistration}>
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </Btn>
          </div>
        </div>
      )}
    </AuthShell>
  )
}

export function RecuperarSenhaPage({ nav }: { nav: (p: Page) => void }) {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")
  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Enviaremos um link para seu e-mail"
      footer={
        <p
          style={{
            textAlign: "center",
            color: T.muted,
            fontSize: 14,
            fontFamily: ff.body,
          }}
        >
          <button
            onClick={() => nav("login")}
            style={{
              background: "none",
              border: "none",
              color: T.purple,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: ff.body,
              fontSize: 14,
            }}
          >
            Voltar para o login
          </button>
        </p>
      }
    >
      {sent ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: T.successBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <Icons.Check size={28} color={T.success} />
          </div>
          <div>
            <H3 style={{ marginBottom: 8, fontSize: 17 }}>E-mail enviado!</H3>
            <p
              style={{
                color: T.muted,
                fontSize: 14,
                lineHeight: 1.65,
                fontFamily: ff.body,
              }}
            >
              Verifique sua caixa de entrada e clique no link para redefinir sua
              senha. O link expira em 30 minutos.
            </p>
          </div>
          <Alert type="info">
            Não recebeu? Verifique a pasta de spam ou tente novamente.
          </Alert>
          <Btn full onClick={() => setSent(false)}>
            Reenviar e-mail
          </Btn>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Alert type="info">
            Informe o e-mail cadastrado para receber o link de recuperacao.
          </Alert>
          <AuthInput
            label="E-mail cadastrado"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="seu@email.com"
          />
          <Btn
            full
            size="lg"
            onClick={() => setSent(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))}
          >
            Enviar link de recuperação
          </Btn>
          <p
            style={{
              textAlign: "center",
              color: T.muted,
              fontSize: 12,
              fontFamily: ff.body,
            }}
          >
            Demonstração visual, sem envio de e-mail.
          </p>
        </div>
      )}
    </AuthShell>
  )
}

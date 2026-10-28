import { T, ff } from "../tokens"
import { Btn, H2, SectionLabel, PageWrap, EmptyState } from "../components/ui"
import { Icons } from "../components/icons"

export function InstagramPage() {
  return (
    <PageWrap>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: `linear-gradient(135deg, #833AB4, #FD1D1D, #FCAF45)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Icons.Instagram size={40} color="#fff" />
        </div>
        <SectionLabel>Redes sociais</SectionLabel>
        <H2 style={{ marginBottom: 8 }}>@essenciaorganizada</H2>
        <p
          style={{
            color: T.muted,
            fontSize: 15,
            marginBottom: 24,
            fontFamily: ff.body,
          }}
        >
          Acompanhe as novidades da comunidade.
        </p>
        <Btn size="lg">Seguir no Instagram</Btn>
      </div>
      <EmptyState
        icon={<Icons.Instagram size={28} color={T.lilac} />}
        title="Nenhuma publicação disponível"
        subtitle="As novidades da comunidade aparecerão aqui."
      />
    </PageWrap>
  )
}

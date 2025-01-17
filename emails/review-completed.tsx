import { 
  Html,
  Head, 
  Body,
  Container,
  Text,
  Link,
  Preview
} from '@react-email/components'

interface ReviewCompletedEmailProps {
  buildingName: string
  reviewerName: string
}

export default function ReviewCompletedEmail({ buildingName, reviewerName }: ReviewCompletedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sua solicitação de review foi respondida!</Preview>
      <Body>
        <Container>
          <Text>Olá!</Text>
          <Text>
            {reviewerName} acabou de publicar uma review sobre o {buildingName} que você solicitou.
          </Text>
          <Text>
            Você pode ver a review completa acessando nossa plataforma:
          </Text>
          <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/buildings/${encodeURIComponent(buildingName)}`}>
            Ver Review
          </Link>
          <Text>
            Obrigado por usar nossa plataforma!
          </Text>
        </Container>
      </Body>
    </Html>
  )
} 
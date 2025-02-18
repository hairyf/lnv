export default function Page() {
  console.log(process.env.NEXT_PUBLIC_DEFAULT_A1)
  return <h1>{process.env.NEXT_PUBLIC_DEFAULT_A1}, Next.js!</h1>;
}

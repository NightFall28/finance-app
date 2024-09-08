import { UserButton } from "@clerk/nextjs";


export default function Home() {
  return(
    <div>
      <h1>This is an authenticated route</h1>
      <UserButton/>
    </div>
  )
}

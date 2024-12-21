import { Header } from "../ui/header"
import { Title } from "./title"
import { Logo } from "./logo"

export function LayoutHeader() {
  return (
    <Header>
      <div className="flex w-fit items-center gap-2 ml-5 md:ml-8">
        <Logo size={24} linkToHome />
        <Title responsive={true} />
      </div>
    </Header>
  )
}

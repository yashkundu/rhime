import Link from 'next/link'

export default function SidebarMenuItem({ text, Icon, active, link, disabled }) {

    if(disabled) {
      return (
        <div className="rounded-full w-[52px] xl:w-auto h-[52px] xl:h-auto xl:p-3 flex items-center text-gray-700 justify-center xl:justify-start text-lg space-x-3">
          <Icon className="" 
          sx={{
            color: "#7b877e",
            fontSize: 35
          }}/>
          <span className={`${active && "font-bold"} hidden xl:inline text-lg`}>{text}</span>
        </div>
      )
    }

    return (
      <Link href={link}>
        <div className="hoverEffect flex items-center text-gray-700 justify-center xl:justify-start text-lg space-x-3">
          <Icon className="" 
          sx={{
            color: "#f98b88",
            fontSize: 35
          }}/>
          <span className={`${active && "font-bold"} hidden xl:inline text-lg`}>{text}</span>
        </div>
      </Link>
    );
}
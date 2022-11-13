import Link from "next/link"

export default function Header({
    heading,
    paragraph,
    linkName,
    linkUrl="#"
}){
    return(
        <div className="mb-10">
            <div className="flex justify-center">
                <img 
                    alt=""
                    className="h-14 w-25"
                    src="https://i.ibb.co/f0MpNGJ/LogoName.png"/>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {heading}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 mt-5">
            {paragraph} {' '}
            <Link href={linkUrl}>
                <span className="cursor-pointer font-medium text-stone-900 hover:text-[#e30913]">{linkName}</span>
            </Link>
            </p>
        </div>
    )
}
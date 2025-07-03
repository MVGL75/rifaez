import { BadgeCheck } from "lucide-react";


export default function VerifiedFooter(){
    return (
        <div className="bg-backgroundRaffle border-t-2 border-borderRaffle text-colorRaffle flex gap-3 items-center justify-center px-3 p-3">
            <BadgeCheck />
            Estas Rifas Son Seguras
        </div>
    )
}
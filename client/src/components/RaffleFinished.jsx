import { Link } from "react-router-dom";

const RaffleFinished = ({setViewStatistics}) => {
    const deleteRaffle = () => {

    }
    return (
    <div className="flex justify-center items-center flex-col gap-8 h-96 mt-8">
            <div className="shadow-lg rounded-2xl text-center flex flex-col items-center gap-6 bg-background py-8 px-8 w-[500px] max-w-[calc(100vw-24px)] border border-input">
                <h1 className="text-3xl">Rifa ha finalizado</h1>
                <p className="text-base font-normal">Puedes ver las estadísticas de la rifa finalizada o eliminarla de forma permanente.</p>
                <footer className="flex gap-3">
                    <button className="px-4 py-3 bg-primary rounded-lg text-primary-foreground text-sm font-medium" onClick={()=>{setViewStatistics(true)}}>
                        <span>Ver estadísticas</span>
                    </button>
                    <button className="px-4 py-3 bg-destructive rounded-lg text-destructive-foreground text-sm font-medium" onClick={deleteRaffle}>
                        <span>Eliminar Rifa</span>
                    </button>
                </footer>
            </div>
    </div>
    )
}

export default RaffleFinished;
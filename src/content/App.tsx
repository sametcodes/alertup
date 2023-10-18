import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { PanelLeftClose } from 'lucide-react';
import CardsPage from './cards';

type AppProps = {
    root: HTMLElement;
}

const App = ({ root }: AppProps): JSX.Element => {
    return <Sheet>
        <SheetTrigger asChild>
            <Button className="absolute w-12 h-12 top-24 right-0 block rounded-none py-1 px-3 m-0 cursor-pointer bg-green-700 border-none">
                <PanelLeftClose size={24} className="text-white" />
            </Button>
        </SheetTrigger>
        <SheetContent container={root} className="min-w-[1200px] w-full overflow-scroll">
            <CardsPage container={root} />
        </SheetContent>
    </Sheet>
}

export default App;
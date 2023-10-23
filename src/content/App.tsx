import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { PanelLeftClose } from 'lucide-react';
import { SavedJobsList } from './jobs';

const App = (): JSX.Element => {
    return <Sheet>
        <SheetTrigger asChild className="rounded-l-lg">
            <Button className="fixed w-12 h-12 top-24 right-0 block py-1 px-3 m-0 cursor-pointer bg-green-700 border-none rounded-l-[12px]">
                <PanelLeftClose size={24} className="text-white" />
            </Button>
        </SheetTrigger>
        <SheetContent className="overflow-scroll bg-white">
            <h4 className="text-xl text-green-700">Alert<b>Up</b></h4>
            <SavedJobsList />
        </SheetContent>
    </Sheet>
}

export default App;
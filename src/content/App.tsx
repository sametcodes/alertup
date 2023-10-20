import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { PanelLeftClose } from 'lucide-react';
import { SavedJobsList } from './jobs';

const App = (): JSX.Element => {
    return <Sheet>
        <SheetTrigger asChild>
            <Button className="fixed w-12 h-12 top-24 right-0 block rounded-none py-1 px-3 m-0 cursor-pointer bg-green-700 border-none">
                <PanelLeftClose size={24} className="text-white" />
            </Button>
        </SheetTrigger>
        <SheetContent className="overflow-scroll bg-white">
            <SavedJobsList />
        </SheetContent>
    </Sheet>
}

export default App;
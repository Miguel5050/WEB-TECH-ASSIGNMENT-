import { useState } from 'react'
import LibraryButton from './LibraryButton'

function LibraryMain() {
    const [count,setCount] = useState(0);

    function incrementNumber() {
        setCount(count + 1);
        console.log("This is the increment value: ", +count);
    }

    return (
        
        <div> <main>
        <h2>WELCOMING PAGE</h2>
        <LibraryButton buttonLabel="Increment" buttonAction={incrementNumber} />
        <div> Increment value: {count} </div>
        </main>

        </div>
    );


    
}

export default LibraryMain

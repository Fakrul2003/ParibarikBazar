import Navbar from '@/components/myProduct/Navbar';
import React from 'react';

export default function ({auth}:{ auth?:any}) {
    return (
        <div>
         <Navbar auth={auth}/>

        </div>
    );
}

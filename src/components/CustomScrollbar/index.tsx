import React, { ReactNode } from "react";

interface Props {
    children?: ReactNode
    // any props that come into the component
}


const CustomScrollbar = ({children}: Props)  => {
    return (
        <div>
            {children}
        </div>
    )
}


export default CustomScrollbar
import { useEffect } from 'react'

const Redirect = () => {
    useEffect(() => {
        if(window.location)
        {
            self.close();
        }
    }, []);

    return (<></>)
}

export default Redirect

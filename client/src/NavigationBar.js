import { Navbar, Button } from "react-bootstrap";
import { useState } from "react";
import ModalLogin from "./ModalLogin";

function NavigationBar() {

    const [showLogin, setShowLogin] = useState(false);


    return (
        <>
            <Navbar bg="primary" variant="dark" className="justify-content-between">
                <Navbar.Brand>
                    <h3>
                        EssentialSurvey
                    </h3>
                </Navbar.Brand>

                <Button variant="secondary" onClick={() => setShowLogin(true)}>
                    Login
                </Button>
            </Navbar>
            <ModalLogin showLogin={showLogin} setShowLogin={setShowLogin}></ModalLogin>
        </>
    );
}

export default NavigationBar;
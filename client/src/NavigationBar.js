import { Navbar, Button } from "react-bootstrap";
import { useState } from "react";
import ModalLogin from "./ModalLogin";
import API from "./API";

function NavigationBar(props) {

    const [showLogin, setShowLogin] = useState(false);

    const logout = async () => {
        await API.logout();
        props.setAdmin({});
    }

    return (
        <>
            <Navbar bg="primary" variant="dark" className="justify-content-between">
                <Navbar.Brand>
                    <h3>
                        EssentialSurvey
                    </h3>
                </Navbar.Brand>
                {props.admin.username ? (<Button variant="secondary" onClick={() => logout()}>
                    Logout
                </Button>) : (<Button variant="secondary" onClick={() => setShowLogin(true)}>
                    Login
                </Button>)
                }
            </Navbar>
            <ModalLogin showLogin={showLogin} setShowLogin={setShowLogin} setAdmin={props.setAdmin}></ModalLogin>
        </>
    );
}

export default NavigationBar;
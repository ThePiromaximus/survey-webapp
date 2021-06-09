import { Navbar, Button } from "react-bootstrap";

function NavigationBar() {

    return (
        <Navbar bg="primary" variant="dark" className="justify-content-between">
            <Navbar.Brand>
                <h3>
                    EssentialSurvey
                </h3>
            </Navbar.Brand>

            <Button variant="secondary">
                Login
            </Button>
        </Navbar>
    );
}

export default NavigationBar;
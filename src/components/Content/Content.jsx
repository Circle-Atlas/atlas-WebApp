export default function Content ({page}) {
    switch (page) {
        case "LOGIN":
        return(
            <div id="page-login">
                <div id="container-left">
                    <h2>
                        Bem-vindo ao<br></br>
                        <img id="logo-atlas" src="" alt="Logo Atlas" />
                        Um app educacional projetado<br></br>
                        especialmente para auxiliar você na sua redação nos vestibulares.
                    </h2>
                </div>
                <div id="container-right">

                </div>
            </div>
        )
    }
}
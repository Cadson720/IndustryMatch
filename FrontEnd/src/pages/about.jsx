import "../styles/about.css";
import Footer from "./footer";

const About = () => {
    return (
        <div className="about-container">
            <div className="about-top">
                <div className="about-upper-text">
                    <div className='left-column'>
                        <h1>Our Projects</h1>
                        <p>
                            In partnership with industry, community, and government. 
                            Projects that support human and social dimensions of engineering.
                        </p>
                    </div>
                    <div className='right-column'>
                        <h1>AI</h1>
                        <p>
                            Through the innovative use of generative AI, you can freely communicate 
                            with a chat bot that will understand your inputs and provide you with 
                            any projects that meet your specific needs, unique to you.
                        </p>
                    </div>
                </div>
            </div>
            <div className="about-bottom">
                <div className="about-lower-text">
                    <div className="left-column">
                        <h1>About EFI</h1>
                        <img src="/efi_logo_simple.png" alt="Logo" className="logo"/>
                    </div>
                    <div className="right-column">
                        <p>
                            Welcome to the Engineering Futures Initiative (EFI), 
                            a collaborative effort spearheaded by ACED and proudly 
                            representing Australian universities offering engineering programs. 
                            A national body, the EFI is the result of extensive consultations with 
                            educators, employers, professional bodies like Engineers Australia, 
                            and NFPs such as Engineers Without Borders.
                        </p>
                        <p>
                            Our mission is clear: to lead and coordinate the progressive 
                            implementation of the Engineering Futures 2035 recommendations. 
                            We believe in the power of collaboration and partnerships to drive 
                            social and human perspectives in engineering education and practice. 
                            At EFI, we're building a community that values innovation, inclusivity, 
                            and the profound impact engineering can have on society.
                        </p>
                        <p>
                            Projects, resources, news, and events can be shared and promoted 
                            through this website. Join us on this journey towards a more socially 
                            conscious and human-centred engineering landscape.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;

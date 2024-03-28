import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { synthwave84 } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CreateComponent from './components/CreateComponent';
import DeleteComponent from './components/DeleteComponent';
import InfoComponent from './components/InfoComponent';
import MergeComponent from './components/MergeComponent';
import QueryComponent from './components/QueryComponent';
import SigninComponent from './components/SigninComponent';
import SignupComponent from './components/SignupComponent';
import UpdateComponent from './components/UpdateComponent';
import './styles.css';

const components = [
    { name: 'Signup', component: SignupComponent },
    { name: 'Signin', component: SigninComponent },
    { name: 'Create', component: CreateComponent },
    { name: 'Update', component: UpdateComponent },
    { name: 'Delete', component: DeleteComponent },
    { name: 'Info', component: InfoComponent },
    { name: 'Merge', component: MergeComponent },
    { name: 'Query', component: QueryComponent },
];

export default function App() {
    const [activeComponentIndex, setActiveComponentIndex] = useState(0);
    const [showParagraph, setShowParagraph] = useState(true);
    const [opacity, setOpacity] = useState(1);

    const fadeOutParagraph = () => {
        setOpacity(0);
        setTimeout(() => setShowParagraph(false), 500);
    };

    const navigateLeft = () => {
        setActiveComponentIndex((prevIndex) =>
            prevIndex === 0 ? components.length - 1 : prevIndex - 1
        );
        fadeOutParagraph();
    };

    const navigateRight = () => {
        setActiveComponentIndex((prevIndex) =>
            prevIndex === components.length - 1 ? 0 : prevIndex + 1
        );
        fadeOutParagraph();
    };

    const handleSelectChange = (e) => {
        setActiveComponentIndex(Number(e.target.value));
        fadeOutParagraph();
    };

    const ActiveComponent = components[activeComponentIndex].component;

    const codeString = `
    surreal start --auth --user root --pass root

    surreal sql -u root -p root --namespace test --database test -e ws://0.0.0.0:8000

    DEFINE SCOPE account SESSION 24h
    SIGNUP ( CREATE user SET email = $email, pass = crypto::argon2::generate($pass) )
    SIGNIN ( SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(pass, $pass) )
    ;

    DEFINE TABLE demo SCHEMALESS PERMISSIONS FULL;

    DEFINE INDEX unique_email ON user FIELDS email UNIQUE;
    DEFINE INDEX unique_username ON user FIELDS username UNIQUE;`;

    return (
        <div className="app-container">
            <h2>SurrealDB React Hooks Demo</h2>

            {showParagraph && (
                <div className="code-container" style={{ opacity }}>
                    <SyntaxHighlighter language="bash" style={synthwave84}>
                        {codeString}
                    </SyntaxHighlighter>
                </div>
            )}

            <div className="navigation">
                <button onClick={navigateLeft}>{'<'}</button>
                <select
                    onChange={handleSelectChange}
                    value={activeComponentIndex}
                >
                    {components.map((componentInfo, index) => (
                        <option key={componentInfo.name} value={index}>
                            {componentInfo.name}
                        </option>
                    ))}
                </select>
                <button onClick={navigateRight}>{'>'}</button>
            </div>
            <div className="component-viewer">
                <ActiveComponent />
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import './styles.css';
import CreateComponent from './components/CreateComponent';
import DeleteComponent from './components/DeleteComponent';
import InfoComponent from './components/InfoComponent';
import MergeComponent from './components/MergeComponent';
import SigninComponent from './components/SigninComponent';
import SignupComponent from './components/SignupComponent';
import UpdateComponent from './components/UpdateComponent';
import QueryComponent from './components/QueryComponent';

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

  const navigateLeft = () => {
    setActiveComponentIndex((prevIndex) =>
      prevIndex === 0 ? components.length - 1 : prevIndex - 1
    );
  };

  const navigateRight = () => {
    setActiveComponentIndex((prevIndex) =>
      prevIndex === components.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSelectChange = (e) => {
    setActiveComponentIndex(Number(e.target.value));
  };

  const ActiveComponent = components[activeComponentIndex].component;

  return (
    <div className="app-container">
      <h2>SurrealDB React Hooks Demo</h2>
      <div className="navigation">
        <button onClick={navigateLeft}>{"<"}</button>
        <select onChange={handleSelectChange} value={activeComponentIndex}>
          {components.map((componentInfo, index) => (
            <option key={componentInfo.name} value={index}>
              {componentInfo.name}
            </option>
          ))}
        </select>
        <button onClick={navigateRight}>{">"}</button>
      </div>
      <div className="component-viewer">
        <ActiveComponent />
      </div>
      <style>{`
        .app-container {
          text-align: center;
        }
        .navigation {
          margin-bottom: 20px;
        }
        .component-viewer {
          border: 1px solid #ccc;
          padding: 20px;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}

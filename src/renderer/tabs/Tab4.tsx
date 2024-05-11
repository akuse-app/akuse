import React, { useState, ChangeEvent } from 'react';
import Store from 'electron-store'

const STORE = new Store()

// Interfaccia per definire la struttura delle opzioni del select
interface Option {
  value: string;
  label: string;
}

// Props per il componente Element
interface ElementProps {
  label: string;
  children: React.ReactNode;
}

// Componente generico per gli elementi
const Element: React.FC<ElementProps> = ({ label, children }) => {
  return (
    <div className="element">
      <div className="toggler">
        <p>{label}</p>
        {children}
      </div>
    </div>
  );
};

// Props per il componente CheckboxElement
interface CheckboxElementProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

// Componente per gestire gli elementi con i checkbox
const CheckboxElement: React.FC<CheckboxElementProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <Element label={label}>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider round"></span>
      </label>
    </Element>
  );
};

// Props per il componente SelectElement
interface SelectElementProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

// Componente per gestire gli elementi con i select
const SelectElement: React.FC<SelectElementProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <Element label={label}>
      <label>
        <select className="main-select-0" value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </Element>
  );
};
const Tab4: React.FC = () => {
  const [updateProgress, setUpdateProgress] = useState<boolean>(STORE.get('update_progress') as boolean);
  const [watchDubbed, setWatchDubbed] = useState<boolean>(STORE.get('dubbed') as boolean);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(STORE.get('source_flag') as string);

  const handleUpdateProgressChange = () => {
    STORE.set('update_progress', !updateProgress)
    setUpdateProgress(!updateProgress);
  };

  const handleWatchDubbedChange = () => {
    STORE.set('dubbed', !watchDubbed)
    setWatchDubbed(!watchDubbed);
  };

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    STORE.set('source_flag', event.target.value)
    setSelectedLanguage(event.target.value);
  };

  const languageOptions: Option[] = [
    { value: 'US', label: 'English' },
    { value: 'IT', label: 'Italian' },
  ];

  return (
    <div className="main-container">
      <div className="settings-page">
        <h1>Settings</h1>

        <CheckboxElement
          label="Update progress automatically"
          checked={updateProgress}
          onChange={handleUpdateProgressChange}
        />
        <CheckboxElement
          label="Watch dubbed"
          checked={watchDubbed}
          onChange={handleWatchDubbedChange}
        />
        <SelectElement
          label="Select the language in which you want to watch the episodes"
          value={selectedLanguage}
          options={languageOptions}
          onChange={handleLanguageChange}
        />
      </div>
    </div>
  );
};

export default Tab4;

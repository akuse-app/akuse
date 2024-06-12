import React, { ChangeEvent } from 'react';
import Heading from '../components/Heading';
import { useStorageContext } from '../contexts/storage';

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
  value: number | string;
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
  const {
    logged,
    updateProgress,
    watchDubbed,
    selectedLanguage,
    skipTime,
    showDuration,
    updateStorage,
  } = useStorageContext();

  const handleUpdateProgressChange = () => {
    void updateStorage('update_progress', !updateProgress);
  };

  const handleWatchDubbedChange = () => {
    void updateStorage('dubbed', !watchDubbed);
  };

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    void updateStorage('source_flag', event.target.value);
  };

  const handleSkipTimeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    void updateStorage('intro_skip_time', parseInt(event.target.value));
  };

  const handleShowDurationChange = () => {
    void updateStorage('show_duration', !showDuration);
  };

  const languageOptions: Option[] = [
    { value: 'US', label: 'English' },
    { value: 'IT', label: 'Italian' },
  ];

  const skipTimeOptions: Option[] = [
    { value: '60', label: '60' },
    { value: '65', label: '65' },
    { value: '70', label: '70' },
    { value: '75', label: '75' },
    { value: '80', label: '80' },
    { value: '85', label: '85' },
    { value: '90', label: '90' },
    { value: '95', label: '95' },
  ];

  return (
    <div className="body-container  show-tab">
      <div className="main-container">
        <div className="settings-page">
          <Heading text="Settings" />

          {logged && (
            <CheckboxElement
              label="Update progress automatically"
              checked={updateProgress}
              onChange={handleUpdateProgressChange}
            />
          )}
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
          <SelectElement
            label="Select the duration of the intro skip (in seconds)"
            value={skipTime}
            options={skipTimeOptions}
            onChange={handleSkipTimeChange}
          />
          <CheckboxElement
            label="Display the video duration instead of the remaining time."
            checked={showDuration}
            onChange={handleShowDurationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Tab4;

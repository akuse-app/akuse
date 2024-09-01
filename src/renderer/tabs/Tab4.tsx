import Store from 'electron-store';
import { ContentSteeringController } from 'hls.js';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import { ipcRenderer } from 'electron';
import Heading from '../components/Heading';
import Select from '../components/Select';
import toast, { Toaster } from 'react-hot-toast';

const STORE = new Store();

interface Option {
  value: any;
  label: string;
}

interface ElementProps {
  label: string;
  children: React.ReactNode;
}

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

interface CheckboxElementProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

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

interface TextInputElementProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInputElement: React.FC<TextInputElementProps> = ({ label, value, onChange }) => {
  return (
    <div className="text-input-element">
      <label className="text-input-label">{label}</label>
      <input
        type="text"
        className="text-input-field"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

interface SelectElementProps {
  label: string;
  value: number | string;
  options: Option[];
  zIndex?: number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectElement: React.FC<SelectElementProps> = ({
  label,
  value,
  options,
  zIndex = 1,
  onChange,
}) => {
  return (
    <Element label={label}>
      <label>
        <Select
          zIndex={zIndex}
          options={[...options]}
          selectedValue={value}
          onChange={onChange}
          width={140}
        />
      </label>
    </Element>
  );
};

const Tab4: React.FC = () => {
  const logged = useContext(AuthContext);

  const [updateProgress, setUpdateProgress] = useState<boolean>(
    STORE.get('update_progress') as boolean,
  );
  const [autoplayNext, setAutoplayNext] = useState<boolean>(
    STORE.get('autoplay_next') as boolean,
  );
  const [watchDubbed, setWatchDubbed] = useState<boolean>(
    STORE.get('dubbed') as boolean,
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    STORE.get('source_flag') as string,
  );
  const [skipTime, setSkipTime] = useState<number>(
    STORE.get('intro_skip_time') as number,
  );
  const [showDuration, setShowDuration] = useState<boolean>(
    STORE.get('show_duration') as boolean,
  );
  const [episodesPerPage, setEpisodesPerPage] = useState<number>(
    STORE.get('episodes_per_page') as number,
  );

  const [clearHistory, setClearHistory] = useState<boolean>(false);

  const handleEpisodesPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    /* Should probably swap this for the dropdown instead, but I like the freedom of choosing anything. */
    let value = event.target.value;
    if(/[a-zA-Z\.]/.test(value))
      value = value.replaceAll(/[a-zA-Z\.]/g, '');

    let number = Math.max(Number(value), 1);
    if(Number.isNaN(number))
      number = 1;

    STORE.set('episodes_per_page', number);
    setEpisodesPerPage(number);
  };

  const handleClearHistory = () => {
    STORE.set('history', { entries: {} });
    setClearHistory(!clearHistory);
  }

  const handleUpdateProgressChange = () => {
    STORE.set('update_progress', !updateProgress);
    setUpdateProgress(!updateProgress);
  };

  const handleWatchDubbedChange = () => {
    STORE.set('dubbed', !watchDubbed);
    setWatchDubbed(!watchDubbed);
  };

  const handleLanguageChange = (value: any) => {
    STORE.set('source_flag', value);
    setSelectedLanguage(value);
  };

  const handleSkipTimeChange = (value: any) => {
    STORE.set('intro_skip_time', parseInt(value));
    setSkipTime(parseInt(value));
  };

  const handleShowDurationChange = () => {
    STORE.set('dubbed', !showDuration);
    setShowDuration(!showDuration);
  };

  const handleAutoplayNextChange = () => {
    STORE.set('autoplay_next', !autoplayNext);
    setAutoplayNext(!autoplayNext);
  };

  const languageOptions: Option[] = [
    { value: 'US', label: 'English' },
    { value: 'IT', label: 'Italian' },
    { value: 'HU', label: 'Hungarian' },
  ];

  const skipTimeOptions: Option[] = [
    { value: 60, label: '60' },
    { value: 65, label: '65' },
    { value: 70, label: '70' },
    { value: 75, label: '75' },
    { value: 80, label: '80' },
    { value: 85, label: '85' },
    { value: 90, label: '90' },
    { value: 95, label: '95' },
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
            label="Autoplay next episode"
            checked={autoplayNext}
            onChange={handleAutoplayNextChange}
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
            zIndex={4}
            onChange={handleLanguageChange}
          />
          <SelectElement
            label="Select the duration of the intro skip (in seconds)"
            value={skipTime}
            options={skipTimeOptions}
            zIndex={3}
            onChange={handleSkipTimeChange}
          />
          <CheckboxElement
            label="Display the video duration instead of the remaining time."
            checked={showDuration}
            onChange={handleShowDurationChange}
          />
          <TextInputElement
            label="Episodes Per Page"
            value={String(episodesPerPage)}
            onChange={handleEpisodesPerPage}
          />
          <CheckboxElement
            label="Clear local history"
            checked={clearHistory}
            onChange={handleClearHistory}
          />
        </div>
      </div>
      <Toaster/>
    </div>
  );
};

export default Tab4;

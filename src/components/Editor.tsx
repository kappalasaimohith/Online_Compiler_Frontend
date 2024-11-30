import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import languages from './Languages';
const apiurl = process.env.NEXT_PUBLIC_API_URL;

const Editor = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(userPrefersDark);
  }, []);

  const [code, setCode] = useState<string>(languages['python'].sampleCode);
  const [filename, setFileName] = useState<string>('main.py');
  const [output, setOutput] = useState<string>('');
  const [language, setLanguage] = useState<'python' | 'javascript' | 'go' | 'php' | 'rust' | 'cpp'>('python');
  const [outputColor, setOutputColor] = useState<string>('text-green-500');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLanguageChange = (lang: 'python' | 'javascript' | 'go' | 'php' | 'rust' | 'cpp') => {
    setLanguage(lang);
    setOutput('');
    setFileName(`main${languages[lang].fileExtension}`);
    setCode(languages[lang].sampleCode);
  };

  const executeCode = async (code: string, lang: string): Promise<string> => {
    try {
      const response = await fetch(`${apiurl}/api/execute-${lang}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();
      setOutputColor(result.isError ? 'text-red-500' : 'text-green-500');
      return result.output;
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput('');
    let outputBuffer = '';
    let isError = false;

    try {
      const result = await executeCode(code, language);
      outputBuffer = result || 'Execution successful';
      outputBuffer += '\n\n=== Finished ===';
    } catch (error: any) {
      isError = true;
      outputBuffer = `Error: ${error.message}`;
    }

    setOutput(outputBuffer);
    setIsLoading(false);
  };

  const handleClear = () => {
    setOutput('');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const editorTheme = isDarkMode ? oneDark : 'light';
  const appBackground = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';

  const lightModeEditorStyle = {
    backgroundColor: '#f5f5f5',
    color: '#333333',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  };

  const languageSelectorBg = isDarkMode ? 'bg-[#2d3436]' : 'bg-[#e3e4e8]';

  return (
    <div className={`w-full min-h-screen ${appBackground} font-mono flex flex-col md:flex-row transition-all`}>
      <div className={`flex justify-start md:flex-col items-center md:items-start ${languageSelectorBg} p-2 space-x-4 md:space-x-0 md:space-y-4`}>
        {Object.entries(languages).map(([lang, config]) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang as 'python' | 'javascript' | 'go' | 'php' | 'rust' | 'cpp')}
            className={`w-14 h-14 flex justify-center items-center rounded-full transition-transform transform duration-200 ease-in-out ${language === lang ? 'bg-gradient-to-r from-blue-500 to-indigo-600 scale-110 shadow-lg' : 'bg-gray-100 hover:bg-blue-700 hover:shadow-md'}`}
          >
            <img src={config.icon} alt={lang} className="w-12 h-12 object-cover rounded-full" />
          </button>
        ))}
      </div>

      <div className="flex flex-col w-full p-4 md:w-3/5 md:border-r border-transparent">
        <div className="flex justify-between items-center bg-gray-800 p-2 rounded-lg text-left shadow-lg mb-4">
          <span className="text-sm text-[#ffffff]">{filename}</span>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className={`p-3 mr-4 rounded-full transition-all duration-300 ${!isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} hover:scale-105`}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              className={`bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-full shadow-md text-lg transition-all duration-[1300ms] transform flex items-center justify-center`}
              onClick={handleRunCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="relative w-8 h-8 border-t-4 border-red-500 border-solid rounded-full animate-spin"></div>
              ) : (
                'Run'
              )}
            </button>
          </div>
        </div>
        <CodeMirror
          value={code}
          height="80vh"
          extensions={[languages[language].extension()]}
          theme={editorTheme}
          onChange={(value) => setCode(value)}
          style={isDarkMode ? undefined : lightModeEditorStyle}
          className="w-full text-lg p-4 rounded-lg shadow-xl transition-all"
        />
      </div>

      <div className={`w-full p-4 md:w-2/5 md:border-l border-transparent ${isDarkMode ? 'bg-black text-teal-50' : 'bg-gray-100 text-black'}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg">Output:</div>
          <button
            className="bg-red-600 text-white p-3 rounded-full shadow-md"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
        <pre 
          className={`text-lg font-mono whitespace-pre-wrap break-words rounded-lg shadow-md p-4 transition-all ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${outputColor}`}
          style={{ display: output ? 'block' : 'none' }} // Conditionally hide or show the pre tag based on output
        >
          {output}
        </pre>
      </div>
    </div>
  );
};

export default Editor;

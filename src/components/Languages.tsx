import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { go } from '@codemirror/lang-go';
import { php } from '@codemirror/lang-php';
import { rust } from '@codemirror/lang-rust';
import { cpp } from '@codemirror/lang-cpp';
import samplecode from './SampleCode';

interface LanguageConfig {
  extension: typeof python;
  icon: string;
  fileExtension: string;
  sampleCode: string;
}

type Languages = {
  [key: string]: LanguageConfig;
};

const languages: Languages = {
  python: { extension: python, icon: 'icons/python.svg', fileExtension: '.py', sampleCode: samplecode.python },
  javascript: { extension: javascript, icon: 'icons/javascript.svg', fileExtension: '.js', sampleCode: samplecode.javascript },
  go: { extension: go, icon: 'icons/Go.svg', fileExtension: '.go', sampleCode: samplecode.go },
  php: { extension: php, icon: 'icons/php.svg', fileExtension: '.php', sampleCode: samplecode.php },
  rust: { extension: rust, icon: 'icons/rust.svg', fileExtension: '.rs', sampleCode: samplecode.rust },
  cpp: { extension: cpp, icon: 'icons/cpp.svg', fileExtension: '.cpp', sampleCode: samplecode.cpp },
  swift: { extension: python, icon: 'icons/swift.svg', fileExtension: '.swift', sampleCode: samplecode.swift },
};

export default languages;

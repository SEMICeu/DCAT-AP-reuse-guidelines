// Turtle syntax highlighting for ReSpec documents
// Custom implementation for DCAT-AP reuse guidelines

async function setupTurtleHighlighting() {
    const turtleBlocks = document.querySelectorAll('pre.turtle');
    
    turtleBlocks.forEach((pre, index) => {
        // Get the text content (this converts HTML entities to actual characters)
        let content = pre.textContent || pre.innerText;
        
        // Clear the pre element
        pre.innerHTML = '';
        
        // Process the content line by line but preserve newlines
        let lines = content.split('\n');
        
        lines.forEach((line, lineIndex) => {
            // Check if this is a comment line
            if (line.trim().startsWith('#')) {
                let commentSpan = document.createElement('span');
                commentSpan.className = 'turtle-comment';
                commentSpan.textContent = line;
                pre.appendChild(commentSpan);
            } else {
                // For non-comment lines, apply highlighting but keep as text
                let lineSpan = highlightTurtleLineSimple(line);
                pre.appendChild(lineSpan);
            }
            
            // Add newline except for the last line
            if (lineIndex < lines.length - 1) {
                pre.appendChild(document.createTextNode('\n'));
            }
        });
    });
}

function highlightTurtleLineSimple(line) {
    let lineSpan = document.createElement('span');
    let fragment = document.createDocumentFragment();
    
    // Process URIs first
    let uriRegex = /<([^>]+)>/g;
    let lastIndex = 0;
    let match;
    
    while ((match = uriRegex.exec(line)) !== null) {
        // Add text before URI
        if (match.index > lastIndex) {
            let beforeText = line.substring(lastIndex, match.index);
            fragment.appendChild(processTextSegment(beforeText));
        }
        
        // Add highlighted URI
        let uriSpan = document.createElement('span');
        uriSpan.className = 'turtle-uri';
        uriSpan.textContent = match[0];
        fragment.appendChild(uriSpan);
        
        lastIndex = match.index + match[0].length;
    }
    
    // Process remaining text
    if (lastIndex < line.length) {
        let remainingText = line.substring(lastIndex);
        fragment.appendChild(processTextSegment(remainingText));
    }
    
    lineSpan.appendChild(fragment);
    return lineSpan;
}

function processTextSegment(text) {
    if (!text) return document.createTextNode('');
    
    let fragment = document.createDocumentFragment();
    
    // Process and protect string literals to avoid interference
    let stringRegex = /"([^"]*)"/g;
    let lastIndex = 0;
    let match;
    
    while ((match = stringRegex.exec(text)) !== null) {
        // Add text before string (process for prefixed names)
        if (match.index > lastIndex) {
            let beforeText = text.substring(lastIndex, match.index);
            fragment.appendChild(processPrefixedNames(beforeText));
        }
        
        // Add highlighted string (protected from further processing)
        let stringSpan = document.createElement('span');
        stringSpan.className = 'turtle-string';
        stringSpan.textContent = match[0];
        fragment.appendChild(stringSpan);
        
        lastIndex = match.index + match[0].length;
    }
    
    // Process remaining text for prefixed names
    if (lastIndex < text.length) {
        let remainingText = text.substring(lastIndex);
        fragment.appendChild(processPrefixedNames(remainingText));
    }
    
    return fragment;
}

function processPrefixedNames(text) {
    if (!text) return document.createTextNode('');
    
    let fragment = document.createDocumentFragment();
    
    // Handle prefixed names (namespace:localname)
    let prefixRegex = /\b([a-zA-Z][a-zA-Z0-9]*):([a-zA-Z][a-zA-Z0-9_-]*)\b/g;
    let lastIndex = 0;
    let prefixMatch;
    
    while ((prefixMatch = prefixRegex.exec(text)) !== null) {
        // Add text before match
        if (prefixMatch.index > lastIndex) {
            let beforeText = text.substring(lastIndex, prefixMatch.index);
            fragment.appendChild(processKeywords(beforeText));
        }
        
        // Add prefix part
        let prefixSpan = document.createElement('span');
        prefixSpan.className = 'turtle-prefix-name';
        prefixSpan.textContent = prefixMatch[1];
        fragment.appendChild(prefixSpan);
        
        // Add colon
        fragment.appendChild(document.createTextNode(':'));
        
        // Add local name part
        let localSpan = document.createElement('span');
        localSpan.className = 'turtle-local-name';
        localSpan.textContent = prefixMatch[2];
        fragment.appendChild(localSpan);
        
        lastIndex = prefixMatch.index + prefixMatch[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
        let remainingText = text.substring(lastIndex);
        fragment.appendChild(processKeywords(remainingText));
    }
    
    return fragment;
}

function processKeywords(text) {
    if (!text) return document.createTextNode('');
    
    let fragment = document.createDocumentFragment();
    
    // Handle language tags
    let langRegex = /@([a-zA-Z][a-zA-Z0-9-]*)\b/g;
    let lastIndex = 0;
    let match;
    
    while ((match = langRegex.exec(text)) !== null) {
        // Add text before language tag
        if (match.index > lastIndex) {
            let beforeText = text.substring(lastIndex, match.index);
            fragment.appendChild(processSimpleKeywords(beforeText));
        }
        
        // Add highlighted language tag
        let langSpan = document.createElement('span');
        langSpan.className = 'turtle-lang';
        langSpan.textContent = match[0];
        fragment.appendChild(langSpan);
        
        lastIndex = match.index + match[0].length;
    }
    
    // Process remaining text for simple keywords
    if (lastIndex < text.length) {
        let remainingText = text.substring(lastIndex);
        fragment.appendChild(processSimpleKeywords(remainingText));
    }
    
    return fragment;
}

function processSimpleKeywords(text) {
    if (!text) return document.createTextNode('');
    
    let fragment = document.createDocumentFragment();
    
    // Handle 'a', 'true', 'false' keywords
    let keywordRegex = /\b(a|true|false)\b/g;
    let lastIndex = 0;
    let match;
    
    while ((match = keywordRegex.exec(text)) !== null) {
        // Add text before keyword
        if (match.index > lastIndex) {
            let beforeText = text.substring(lastIndex, match.index);
            fragment.appendChild(document.createTextNode(beforeText));
        }
        
        // Add highlighted keyword
        let keywordSpan = document.createElement('span');
        keywordSpan.className = 'turtle-keyword';
        keywordSpan.textContent = match[1];
        fragment.appendChild(keywordSpan);
        
        lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
        let remainingText = text.substring(lastIndex);
        fragment.appendChild(document.createTextNode(remainingText));
    }
    
    return fragment;
}

// Semantic Search Dictionary and Engine
// A client-side, 100% offline text-similarity search engine using synonym expansion and TF-IDF style Cosine Similarity.

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'cant', 'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont',
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have',
  'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'isnt',
  'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over',
  'own', 'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such',
  'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres',
  'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'werent',
  'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom',
  'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve',
  'your', 'yours', 'yourself', 'yourselves'
]);

// Semantic groups representing different conceptual tasks.
// If query contains "buy" and task contains "grocery", both map to "ACQUISITION".
const SEMANTIC_CONCEPTS = {
  ACQUISITION: [
    'buy', 'purchase', 'shop', 'shopping', 'grocery', 'groceries', 'supermarket', 'get', 'fetch',
    'order', 'acquire', 'spend', 'items', 'store', 'market', 'mall', 'food', 'milk', 'bread'
  ],
  WORK: [
    'work', 'office', 'job', 'meeting', 'boss', 'presentation', 'client', 'resume', 'project',
    'email', 'task', 'duty', 'corporate', 'colleague', 'call', 'report', 'manager', 'desk', 'deadline'
  ],
  EDUCATION: [
    'study', 'learn', 'read', 'book', 'homework', 'assignment', 'class', 'course', 'exam',
    'test', 'school', 'college', 'university', 'lecture', 'write', 'tutorial', 'notes', 'quiz'
  ],
  HEALTH: [
    'health', 'gym', 'workout', 'run', 'exercise', 'jog', 'walk', 'doctor', 'dentist', 'medicine',
    'pill', 'diet', 'fitness', 'stretch', 'yoga', 'medical', 'clinic', 'training', 'healthy', 'appointment'
  ],
  HOUSEHOLD: [
    'clean', 'wash', 'laundry', 'dishes', 'cook', 'kitchen', 'vacuum', 'sweep', 'fix', 'repair',
    'garden', 'plant', 'plants', 'water', 'trash', 'garbage', 'house', 'apartment', 'home', 'room'
  ],
  FINANCE: [
    'finance', 'money', 'pay', 'bill', 'rent', 'bank', 'credit', 'card', 'invoice', 'tax',
    'budget', 'expense', 'payment', 'transfer', 'subscribe', 'subscription', 'cash'
  ],
  LEISURE: [
    'leisure', 'relax', 'play', 'game', 'movie', 'watch', 'show', 'concert', 'hobby', 'sport',
    'friend', 'friends', 'family', 'party', 'fun', 'travel', 'trip', 'flight', 'ticket', 'hotel'
  ],
  COMMUNICATION: [
    'call', 'talk', 'email', 'chat', 'message', 'text', 'write', 'notify', 'speak', 'contact',
    'meet', 'zoom', 'skype', 'teams', 'discord', 'slack'
  ],
  URGENCY: [
    'urgent', 'fast', 'quick', 'asap', 'now', 'important', 'priority', 'immediately', 'rush', 'critical'
  ]
};

// Tokenize text into words, filter out stop words, and lowercase
function preprocess(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

// Map a token to semantic concept strings
function getSemanticConcepts(word) {
  const concepts = [];
  for (const [conceptName, wordList] of Object.entries(SEMANTIC_CONCEPTS)) {
    if (wordList.includes(word)) {
      concepts.push(conceptName);
    }
  }
  return concepts;
}

// Build a frequency vector representing both raw tokens and semantic concepts
function buildFrequencyVector(tokens, conceptWeight = 0.5) {
  const vector = {};
  
  tokens.forEach(token => {
    // Exact word count
    vector[token] = (vector[token] || 0) + 1;
    
    // Concept expansion
    const concepts = getSemanticConcepts(token);
    concepts.forEach(concept => {
      const key = `CONCEPT:${concept}`;
      vector[key] = (vector[key] || 0) + conceptWeight;
    });
  });
  
  return vector;
}

// Calculate the Cosine Similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  // Set of all keys
  const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

  keys.forEach(key => {
    const valA = vecA[key] || 0;
    const valB = vecB[key] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  });

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Calculates a semantic similarity score between query and a task.
 * Gives 2x weight to matches found in task title versus task description.
 * @param {string} query - The search query
 * @param {object} task - The task object
 * @returns {number} score between 0 and 1
 */
export function calculateSemanticScore(query, task) {
  if (!query || !task) return 0;

  const queryTokens = preprocess(query);
  if (queryTokens.length === 0) return 0;

  const titleTokens = preprocess(task.title);
  const descTokens = preprocess(task.description || '');

  // Build query vector
  const queryVector = buildFrequencyVector(queryTokens, 0.6);

  // Build task vector with title having 2x importance
  const titleVector = buildFrequencyVector(titleTokens, 0.6);
  const descVector = buildFrequencyVector(descTokens, 0.6);

  const combinedTaskVector = {};
  
  // Combine title tokens (weighted 2.0)
  Object.keys(titleVector).forEach(key => {
    combinedTaskVector[key] = (combinedTaskVector[key] || 0) + titleVector[key] * 2.0;
  });

  // Combine description tokens (weighted 1.0)
  Object.keys(descVector).forEach(key => {
    combinedTaskVector[key] = (combinedTaskVector[key] || 0) + descVector[key] * 1.0;
  });

  // Also factor in labels if any match query terms
  if (task.labels && task.labels.length > 0) {
    task.labels.forEach(label => {
      const cleanLabel = label.toLowerCase().trim();
      if (queryTokens.includes(cleanLabel)) {
        // Boost direct label matches
        combinedTaskVector[cleanLabel] = (combinedTaskVector[cleanLabel] || 0) + 3.0;
      }
    });
  }

  return cosineSimilarity(queryVector, combinedTaskVector);
}

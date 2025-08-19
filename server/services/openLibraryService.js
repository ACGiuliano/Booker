const https = require('https');

/**
 * Open Library API service for book search and details
 */
class OpenLibraryService {
  constructor() {
    this.baseUrl = 'https://openlibrary.org';
    this.searchUrl = 'https://openlibrary.org/search.json';
    this.coversUrl = 'https://covers.openlibrary.org/b';
  }

  /**
   * Search for books using Open Library API
   * @param {string} query - Search query (title, author, etc.)
   * @param {number} limit - Number of results to return (default 10)
   * @returns {Promise<Array>} Array of book objects
   */
  async searchBooks(query, limit = 10) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.searchUrl}?q=${encodedQuery}&limit=${limit}&fields=key,title,author_name,first_publish_year,number_of_pages_median,isbn,cover_i,publisher,subject`;
      
      const data = await this.makeRequest(url);
      const response = JSON.parse(data);
      
      if (!response.docs) {
        return [];
      }

      return response.docs.map(book => this.formatBookData(book));
    } catch (error) {
      console.error('Open Library search error:', error);
      throw new Error('Failed to search books from Open Library');
    }
  }

  /**
   * Get book details by Open Library key
   * @param {string} key - Open Library book key (e.g., '/works/OL45804W')
   * @returns {Promise<Object>} Book details
   */
  async getBookDetails(key) {
    try {
      const url = `${this.baseUrl}${key}.json`;
      const data = await this.makeRequest(url);
      const book = JSON.parse(data);
      
      return this.formatDetailedBookData(book);
    } catch (error) {
      console.error('Open Library book details error:', error);
      throw new Error('Failed to get book details from Open Library');
    }
  }

  /**
   * Get book by ISBN
   * @param {string} isbn - ISBN-10 or ISBN-13
   * @returns {Promise<Object>} Book data
   */
  async getBookByISBN(isbn) {
    try {
      const url = `${this.baseUrl}/isbn/${isbn}.json`;
      const data = await this.makeRequest(url);
      const book = JSON.parse(data);
      
      return this.formatDetailedBookData(book);
    } catch (error) {
      console.error('Open Library ISBN lookup error:', error);
      throw new Error('Failed to find book by ISBN');
    }
  }

  /**
   * Format book data from search results
   * @param {Object} book - Raw book data from Open Library
   * @returns {Object} Formatted book data
   */
  formatBookData(book) {
    return {
      openLibraryKey: book.key,
      title: book.title || 'Unknown Title',
      author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
      firstPublishYear: book.first_publish_year || null,
      pages: book.number_of_pages_median || null,
      isbn: book.isbn ? book.isbn[0] : null,
      publishers: book.publisher ? book.publisher.slice(0, 3) : [],
      subjects: book.subject ? book.subject.slice(0, 5) : [],
      coverUrl: book.cover_i ? `${this.coversUrl}/id/${book.cover_i}-M.jpg` : null,
      coverLarge: book.cover_i ? `${this.coversUrl}/id/${book.cover_i}-L.jpg` : null,
      source: 'Open Library'
    };
  }

  /**
   * Format detailed book data
   * @param {Object} book - Raw detailed book data from Open Library
   * @returns {Object} Formatted detailed book data
   */
  formatDetailedBookData(book) {
    return {
      openLibraryKey: book.key,
      title: book.title || 'Unknown Title',
      description: book.description ? 
        (typeof book.description === 'string' ? book.description : book.description.value) : 
        null,
      subjects: book.subjects || [],
      publishDate: book.publish_date || null,
      publishers: book.publishers || [],
      source: 'Open Library'
    };
  }

  /**
   * Make HTTP request to Open Library API
   * @param {string} url - API endpoint URL
   * @returns {Promise<string>} Response data
   */
  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          }
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.setTimeout(10000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  /**
   * Get cover image URL by ISBN or Open Library ID
   * @param {string} identifier - ISBN or Open Library cover ID
   * @param {string} size - 'S' (small), 'M' (medium), 'L' (large)
   * @returns {string} Cover image URL
   */
  getCoverUrl(identifier, size = 'M') {
    if (identifier.length === 10 || identifier.length === 13) {
      // ISBN
      return `${this.coversUrl}/isbn/${identifier}-${size}.jpg`;
    } else {
      // Open Library cover ID
      return `${this.coversUrl}/id/${identifier}-${size}.jpg`;
    }
  }
}

module.exports = new OpenLibraryService();

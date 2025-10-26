// Strapi API utilities

interface StrapiImage {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    width?: number;
    height?: number;
    url: string;
    formats?: {
        large?: { url: string; width: number; height: number };
        medium?: { url: string; width: number; height: number };
        small?: { url: string; width: number; height: number };
        thumbnail?: { url: string; width: number; height: number };
    };
}

export interface CarouselItem {
    id: number;
    Title: string;
    Subtitle: string;
    Link_url: string;
    Link_text: string;
    Image?: StrapiImage; // Now we should get this with proper populate
}

export interface Carousel {
    id: number;
    Items: CarouselItem[]; // <-- Mueve 'Items' al nivel superior
    createdAt: string;     // <-- Mueve todo al nivel superior
    updatedAt: string;
    publishedAt: string;
}

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

/**
 * Fetch data from Strapi API
 */
async function fetchAPI(path: string, options: RequestInit = {}) {
    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    const url = `${STRAPI_URL}/api${path}`;

    try {
        const response = await fetch(url, mergedOptions);

        if (!response.ok) {
            let errorMessage = `Failed to fetch from Strapi: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                console.error('Strapi error details:', errorData);
                errorMessage += ` - ${JSON.stringify(errorData)}`;
            } catch (e) {
                // If we can't parse the error response, just use the status text
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('Strapi API error for URL:', url);
        console.error('Strapi API error:', error);
        throw error;
    }
}

/**
 * Get the full URL for a Strapi image (Strapi v5 flattened format)
 */
export function getStrapiImageUrl(image: StrapiImage): string {
    if (!image?.url) {
        return '';
    }

    // If it's already a full URL, return it as is
    if (image.url.startsWith('http')) {
        return image.url;
    }

    // Otherwise, prepend the Strapi URL
    return `${STRAPI_URL}${image.url}`;
}

/**
 * Use proper nested populate for components with media fields
 * Based on Strapi 5 REST API docs: https://docs.strapi.io/cms/api/rest
 */
const WORKING_POPULATE_STRATEGY = '?populate[Items][populate]=*';

/**
 * Fetch all carousels with their items
 */
export async function getCarousels(): Promise<Carousel[]> {
    const response = await fetchAPI(`/carousels${WORKING_POPULATE_STRATEGY}`);
    return response.data || [];
}

/**
 * Fetch a single carousel by ID
 */
export async function getCarousel(id: number): Promise<Carousel | null> {
    const response = await fetchAPI(`/carousels/${id}${WORKING_POPULATE_STRATEGY}`);
    return response.data || null;
}


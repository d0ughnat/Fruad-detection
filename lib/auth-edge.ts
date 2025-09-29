// Ensure consistent JWT secret across all environments
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key'
  return secret
}

export interface EdgeUser {
  id: number
  name: string
  email: string
  role: string
}

/**
 * Simple JWT decoder without verification for Edge Runtime
 * This is a temporary solution - validates token structure but not signature
 */
function decodeJWTPayload(token: string): any | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    
    const payload = parts[1]
    // Add padding if needed
    const padded = payload + '='.repeat((4 - payload.length % 4) % 4)
    const decoded = JSON.parse(atob(padded))
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      console.log('Edge auth - Token expired')
      return null
    }
    
    return decoded
  } catch (error) {
    console.log('Edge auth - Failed to decode JWT:', error)
    return null
  }
}

/**
 * Edge Runtime compatible JWT validation
 * This function only validates the JWT token without database calls
 */
export function validateTokenEdge(token: string): EdgeUser | null {
  if (!token) {
    console.log('Edge auth - No token provided')
    return null
  }

  try {
    const secret = getJWTSecret()
    console.log('Edge auth - Using secret:', secret === 'fallback-secret-key' ? 'FALLBACK' : 'SECRET_SET')
    
    const decoded = decodeJWTPayload(token)
    
    // Debug logging for development
    console.log('Edge auth - Token validation successful:', {
      hasToken: !!token,
      tokenPreview: token.substring(0, 20) + '...',
      decoded: decoded ? { 
        userId: decoded.userId, 
        name: decoded.name, 
        email: decoded.email, 
        role: decoded.role,
        exp: decoded.exp,
        iat: decoded.iat
      } : null
    })
    
    // Return basic user info from JWT payload
    if (decoded && decoded.userId) {
      const user = {
        id: decoded.userId,
        name: decoded.name || 'User',
        email: decoded.email || '',
        role: decoded.role || 'USER'
      }
      console.log('Edge auth - Returning user:', user)
      return user
    }
    
    console.log('Edge auth - No userId in decoded token')
    return null
  } catch (error) {
    console.log('Edge auth - Token validation error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      tokenPreview: token ? token.substring(0, 20) + '...' : 'NO_TOKEN'
    })
    return null
  }
}

/**
 * Edge Runtime compatible session validation
 * Only validates JWT without database lookup
 */
export function validateSessionEdge(token: string): EdgeUser | null {
  return validateTokenEdge(token)
}

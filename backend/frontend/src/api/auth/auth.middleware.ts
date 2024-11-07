import { NextFunction, Response, Request } from 'express';
import { SupabaseService } from '@/supabase/supabase.service';

export async function AuthGuard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const environment = process.env.NODE_ENV || 'development';
    if (environment === 'development') {
      next();
    }
    const supabaseService = SupabaseService.getInstance();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    await supabaseService.getUserFromToken(token);

    next();
  } catch (error) {
    console.error('AuthGuard error:', error);
    return res
      .status(401)
      .json({ message: 'Unauthorized. Authentication failed.' });
  }
}

// export function requireRole(requiredRoles: string[]) {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const userRoles = req.user?.roles || [];
//     const hasRequiredRole = requiredRoles.some((role) =>
//       userRoles.includes(role),
//     );

//     if (!hasRequiredRole) {
//       return res
//         .status(403)
//         .json({ message: 'Forbidden. Insufficient permissions.' });
//     }

//     next();
//   };
// }

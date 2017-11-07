import * as express from 'express';

export default function requiresLogin(req: any, res: any, next: Function) {
  if (req.isAuthenticated()) next();
  else return res.status(401).json({ error: 'Error: User not authorized.' });
}

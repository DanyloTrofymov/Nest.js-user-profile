import { Response } from 'express';

export function sendResponse(res: Response, data: any) {
  return res.json({
    data,
    status: 1
  });
}

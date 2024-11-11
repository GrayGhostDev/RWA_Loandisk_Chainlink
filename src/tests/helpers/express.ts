import { Request, Response } from 'express';

export const mockRequest = (options: any = {}): Partial<Request> => ({
  body: {},
  query: {},
  params: {},
  ...options,
});

export const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};
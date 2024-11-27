export const mockFn = (...args) => jest.fn(...args) as any;
export const mockReturnRejectedValue = data => jest.fn().mockRejectedValue(data);
// TODO: remove the enclosing obj
export const mockReturnValue = data => jest.fn().mockResolvedValue({ data });

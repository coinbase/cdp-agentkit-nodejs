export const mockFn = (...args) => jest.fn(...args) as any;
export const mockReturnRejectedValue = data => jest.fn().mockRejectedValue(data);
export const mockReturnValue = data => jest.fn().mockResolvedValue({ data });

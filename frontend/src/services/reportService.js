export const generateReport = async (payload) => {
    try {
      const response = await fetch('https://magicloops.dev/api/loop/07e48767-2fc4-4a44-8680-f554793f4118/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  };
  
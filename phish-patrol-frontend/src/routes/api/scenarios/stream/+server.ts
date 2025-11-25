import { scenarios } from '$lib/server/scenarioStore';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ request }) => {
  let lastSentId = 0;

  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const newScenarios = scenarios.filter(s => s.id > lastSentId);

        if (newScenarios.length > 0) {
          for (const scenario of newScenarios) {
            const data = `data: ${JSON.stringify(scenario)}\n\n`;
            controller.enqueue(data);
            lastSentId = scenario.id;
          }
        }
      }, 2000); // Check for new scenarios every 2 seconds

      request.signal.onabort = () => {
        clearInterval(interval);
        try{
          controller.close();
        } catch (err){
          console.warn("Stream already closed: ", err)  //fix for contoller being closed already
        }
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
};

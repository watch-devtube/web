export async function onRequestGet({ params, env }) {
  const { id } = params;
  const video = await env.VIDEOS.get(id);
  return new Response(video);
}
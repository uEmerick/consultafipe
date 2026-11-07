const FIPE_API_URL = "https://fipe.parallelum.com.br/api/v2/cars";

function isValidPath(path: string[]) {
  if (path.length === 1) return path[0] === "brands";

  if (path[0] !== "brands" || !/^\d+$/.test(path[1] ?? "")) return false;
  if (path.length === 3) return path[2] === "models";
  if (path[2] !== "models" || !/^\d+$/.test(path[3] ?? "")) return false;
  if (path.length === 5) return path[4] === "years";

  return (
    path.length === 6 &&
    path[4] === "years" &&
    /^\d{4}-\d+$/.test(path[5] ?? "")
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;

  if (!isValidPath(path)) {
    return Response.json({ error: "Caminho de consulta FIPE inválido." }, { status: 400 });
  }

  try {
    const response = await fetch(`${FIPE_API_URL}/${path.join("/")}`, { cache: "no-store" });
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao consultar a API FIPE.";
    return Response.json({ error: message }, { status: 502 });
  }
}

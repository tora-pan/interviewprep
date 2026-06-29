from pathlib import Path
import typer
from jinja2 import Environment, FileSystemLoader
from rich import print

app = typer.Typer()

BASE_DIR = Path(__file__).resolve().parent
SRC_DIR = BASE_DIR.parent / "src"
TEMPLATE_DIR = BASE_DIR / "templates"

env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))


MODULE_FILES = {
    "__init__.py": "__init__.py.j2",
    "routes.py": "routes.py.j2",
    "service.py": "service.py.j2",
    "repository.py": "repository.py.j2",
    "schemas.py": "schemas.py.j2",
}


def render(template_name: str, **ctx):
    template = env.get_template(template_name)
    return template.render(**ctx)


@app.command()
def create_module(name: str):
    module_name = name.lower()
    class_name = name.capitalize()

    module_path = SRC_DIR / "modules" / module_name

    if module_path.exists():
        print(f"[red]Module '{module_name}' already exists[/red]")
        raise typer.Exit()

    module_path.mkdir(parents=True, exist_ok=True)

    for filename, template in MODULE_FILES.items():
        content = render(
            template,
            module_name=module_name,
            class_name=class_name,
        )

        (module_path / filename).write_text(content)

    print(f"\n[green]✔ Created module: {module_name}[/green]\n")

    print("[bold]Next step:[/bold]")
    print(f"""
from src.modules.{module_name}.routes import router as {module_name}_router

app.include_router({module_name}_router)
""")


if __name__ == "__main__":
    app()

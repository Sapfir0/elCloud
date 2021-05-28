defmodule ElCloudWeb.FileStorageController do
  use ElCloudWeb, :controller
  use PhoenixSwagger
  alias ElCloud.FileStorage
  action_fallback ElCloudWeb.FallbackController

  @data_dir Application.get_env(:elCloud, ElCloudWeb.FileStorageController)[:data_dir]

  def swagger_definitions do
    %{
      File:
        swagger_schema do
          title("File")
          description("Get list of files in directory")

          properties do
            isFolder(:bool, "Is folder", required: true)
            children(:string, "List of children files", required: true)
            filename(:string, "Filename", required: true)
          end
        end,
      FileResponse:
        swagger_schema do
          title("File Response")
          description("Response schema for single file")
          property(:data, Schema.ref(:File), "The file details")
        end
    }
  end

  def getSaveFileCount(directory) do
    files = length(File.ls!(directory))
    if files === 0, do: 1, else: files
  end

  swagger_path(:index) do
    get("/api/files")
    summary("List files")
    description("List all files in directory")
    response(200, "OK", Schema.ref(:FileResponse))
  end
  def index(conn, params) do
    directory = @data_dir <> Map.get(params, "directory", "")
    {page, _} = Integer.parse(Map.get(params, "page",  "0"))
    isRecursive = !!Map.get(params, "is_recursive", false)
    page_size = Map.get(params, "page_size", nil)
    real_page_size = if page_size === nil, do: getSaveFileCount(directory), else: String.to_integer(page_size)

    files = FileStorage.list_files(directory, page, real_page_size, isRecursive)
    render(conn, "index.json", tb_files: files)
  end

  swagger_path(:update) do
    put("/api/files")
    summary("Move file")
    description("List all files in directory")
  end
  def move_file(conn, %{"oldPath" => oldPath, "newPath" => newPath}) do
    res = DirectoryTreeHelper.move_file(Path.join(@data_dir, oldPath), Path.join(@data_dir, newPath))
    IO.inspect res
    if res == :ok do
      render(conn, "show.json", file_storage: %{"operation" => res})
    else
      {:error, :folderNotFound}
    end
  end



  swagger_path(:post) do
    PhoenixSwagger.Path.post("/api/files")
    summary("Delete file")
    description("Delete file")
  end
  def create(conn, %{"file" => file, "directory" => directory}) do
    IO.inspect file
    fullpath = Path.join([@data_dir, directory, file.filename])
    IO.inspect fullpath
    File.cp(file.path, Path.absname(fullpath))
    render(conn, "show.json", file_storage: %{"operation" => "success"})
  end

  swagger_path(:delete) do
    PhoenixSwagger.Path.delete("/api/files")
    summary("Delete file")
    description("Delete file")
  end
  def delete(conn, %{"path" => path}) do
    data_path = Path.join(@data_dir, path)
    res = DirectoryTreeHelper.remove_file(data_path)

    if res == :ok do
      render(conn, "show.json", file_storage: %{"operation" => res})
    else
      {:error, :folderNotFound}
    end
  end


end

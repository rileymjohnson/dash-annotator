
module DashAnnotator
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.0.1"

include("jl/''_dashannotator.jl")
include("jl/''_htmlannotator.jl")
include("jl/''_pdfannotator.jl")
include("jl/''_textannotator.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "dash_annotator",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "async-DashAnnotator.js",
    external_url = "https://unpkg.com/dash_annotator@0.0.1/dash_annotator/async-DashAnnotator.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-DashAnnotator.js.map",
    external_url = "https://unpkg.com/dash_annotator@0.0.1/dash_annotator/async-DashAnnotator.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_annotator.min.js",
    external_url = nothing,
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_annotator.min.js.map",
    external_url = nothing,
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end

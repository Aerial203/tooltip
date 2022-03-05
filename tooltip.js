import addGlobalEventListner from "./utils/addGobalEventListener";

const DEFAULT_SPACING = 15
const POSITION_ORDER = ["top", "bottom", "left", "right"]
const POSITION_TO_FUNCTION_MAP = {
    top: position_tooltip_top,
    bottom: position_tooltip_bottom,
    left: position_tooltip_left,
    right: position_tooltip_right
}
const tool_tip_container = document.createElement("div")
tool_tip_container.classList.add("tooltip-container")
document.body.append(tool_tip_container)


addGlobalEventListner("mouseover", "[data-tooltip]", e => {
    const tooltip = create_tool_tip_element(e.target.dataset.tooltip)
    tool_tip_container.append(tooltip)
    position_tool_tip(tooltip, e.target)
    
    e.target.addEventListener("mouseleave", () => {
        tooltip.remove()
    }, 
    { 
        once: true
    })
})

function create_tool_tip_element(text) {
    const tooltip = document.createElement("div")
    tooltip.classList.add("tooltip")
    tooltip.innerText = text
    return tooltip
}

function position_tool_tip(tooltip, element) {
    const element_rect = element.getBoundingClientRect()
    const spacing = parseInt(element.dataset.spacing) || DEFAULT_SPACING
    const preffered_position = (element.dataset.position || "").split("|")
    const position = preffered_position.concat(POSITION_ORDER)
    for (let i = 0; i < position.length; i++) {
        const func = POSITION_TO_FUNCTION_MAP[position[i]]
        if (func && func(tooltip, element_rect, spacing)) return
    }
}

function position_tooltip_top(tooltip, element_rect, spacing) {
    const tool_tip_rect = tooltip.getBoundingClientRect()
    tooltip.style.top = `${element_rect.top - tool_tip_rect.height - spacing}px`
    tooltip.style.left = `${element_rect.left + element_rect.width / 2 - 
    tool_tip_rect.width / 2}px`
    const bounds = is_out_of_bound(tooltip, spacing)
    if (bounds.top) {
        reset_tooltip_position(tooltip)
        return false
    }
    if (bounds.right) {
        tooltip.style.right = `${spacing}px`;
        tooltip.style.left = "Initial";
    }
    if (bounds.left) {
        tooltip.style.left = `${spacing}px`;
    }
    return true
}

function position_tooltip_bottom(tooltip, element_rect, spacing) {
    const tool_tip_rect = tooltip.getBoundingClientRect()
    tooltip.style.top = `${element_rect.bottom + spacing}px`
    tooltip.style.left = `${element_rect.left + element_rect.width / 2 - tool_tip_rect.width / 2}px`
    const bounds = is_out_of_bound(tooltip, spacing)
    if (bounds.bottom) {
        reset_tooltip_position(tooltip)
        return false
    }
    if (bounds.right) {
        tooltip.style.right = `${spacing}px`;
        tooltip.style.left = "Initial";
    }
    if (bounds.left) {
        tooltip.style.left = `${spacing}px`;
    }
    return true
}


function position_tooltip_left(tooltip, element_rect,  spacing) {
    const tool_tip_rect = tooltip.getBoundingClientRect()
    tooltip.style.top = `${element_rect.top + element_rect.height / 2 - 
    tool_tip_rect.height / 2}px`
    tooltip.style.left = `${element_rect.left - tool_tip_rect.width - spacing}px`
    const bounds = is_out_of_bound(tooltip, spacing)
    if (bounds.left) {
        reset_tooltip_position(tooltip)
        return false
    }
    if (bounds.bottom) {
        tooltip.style.bottom = `${spacing}px`;
        tooltip.style.top = "Initial";
    }
    if (bounds.top) {
        tooltip.style.top = `${spacing}px`;
    }
    return true
}

function position_tooltip_right(tooltip, element_rect, spacing) {
    const tool_tip_rect = tooltip.getBoundingClientRect()
    tooltip.style.top = `${element_rect.top + element_rect.height / 2 - 
    tool_tip_rect.height / 2}px`
    tooltip.style.left = `${element_rect.right + spacing}px`
    const bounds = is_out_of_bound(tooltip, spacing)
    if (bounds.right) {
        reset_tooltip_position(tooltip)
        return false
    }
    if (bounds.bottom) {
        tooltip.style.bottom = `${spacing}px`;
        tooltip.style.top = "Initial";
    }
    if (bounds.top) {
        tooltip.style.top = `${spacing}px`;
    }
    return true
    
}

function is_out_of_bound(element, spacing) {
    const rect = element.getBoundingClientRect()
    const container_rect = tool_tip_container.getBoundingClientRect()
    return {
        left: rect.left <= container_rect.left + spacing,
        right: rect.right >= container_rect.right - spacing,
        top: rect.top <= container_rect.top + spacing,
        bottom: rect.bottom >= container_rect.bottom - spacing
    }
}

function reset_tooltip_position(tooltip) {
    tooltip.style.top = `initial`
    tooltip.style.bottom = `initial`
    tooltip.style.left = `initial`
    tooltip.style.right = `initial`
}
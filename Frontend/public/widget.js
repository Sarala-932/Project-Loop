// LOOP Feedback Widget (Simple Vanilla JS)
(function () {
    // 1. Get the workspace ID from the script tag
    const scriptTag = document.currentScript;
    if (!scriptTag) return;
    
    const workspaceId = scriptTag.getAttribute('data-workspace-id');
    if (!workspaceId) {
        console.error("LOOP Widget: Missing data-workspace-id attribute.");
        return;
    }

    // Replace this with your actual production backend URL later
    const BACKEND_URL = "http://localhost:3000/api/widget/submit";

    // 2. Create the floating button
    const button = document.createElement('button');
    button.innerHTML = "💬 Feedback";
    Object.assign(button.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "12px 24px",
        backgroundColor: "#7c3aed", // Violet-600 to match LOOP branding
        color: "white",
        border: "none",
        borderRadius: "50px",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
        zIndex: "999999",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontWeight: "bold",
        fontSize: "14px",
        transition: "transform 0.2s ease"
    });

    // 3. Create the popup modal
    const modal = document.createElement('div');
    Object.assign(modal.style, {
        position: "fixed",
        bottom: "80px",
        right: "20px",
        width: "320px",
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        padding: "24px",
        display: "none",
        zIndex: "999999",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxSizing: "border-box"
    });

    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; color: #0f172a; font-size: 18px; font-weight: bold;">Give Feedback</h3>
            <button id="loop-close-btn" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">&times;</button>
        </div>
        <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px;">Help us improve this product.</p>
        <textarea id="loop-feedback-text" rows="4" style="width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 16px; box-sizing: border-box; resize: none; font-family: inherit; font-size: 14px; outline: none;" placeholder="What do you think?..."></textarea>
        <button id="loop-submit-btn" style="width: 100%; padding: 12px; background-color: #7c3aed; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; transition: background-color 0.2s;">Send Feedback</button>
        <p id="loop-status-msg" style="margin: 12px 0 0 0; font-size: 14px; color: #16a34a; text-align: center; display: none; font-weight: 500;">Thanks! We received it. 🎉</p>
    `;

    document.body.appendChild(button);
    document.body.appendChild(modal);

    // 4. Add Event Listeners
    button.addEventListener('click', () => {
        modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('loop-close-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.getElementById('loop-submit-btn').addEventListener('click', async () => {
        const textArea = document.getElementById('loop-feedback-text');
        const content = textArea.value.trim();
        if (!content) return;

        const submitBtn = document.getElementById('loop-submit-btn');
        submitBtn.innerText = "Sending...";
        submitBtn.style.backgroundColor = "#9333ea";
        submitBtn.disabled = true;

        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspaceId, content, source: "WIDGET" })
            });

            if (response.ok) {
                textArea.value = '';
                document.getElementById('loop-status-msg').style.display = 'block';
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.getElementById('loop-status-msg').style.display = 'none';
                }, 2500);
            } else {
                alert("Failed to send feedback. Please try again.");
            }
        } catch (error) {
            console.error("LOOP Feedback Error:", error);
            alert("Network error.");
        } finally {
            submitBtn.innerText = "Send Feedback";
            submitBtn.style.backgroundColor = "#7c3aed";
            submitBtn.disabled = false;
        }
    });

    // Simple hover effect
    button.addEventListener('mouseover', () => button.style.transform = "scale(1.05)");
    button.addEventListener('mouseout', () => button.style.transform = "scale(1)");
})();

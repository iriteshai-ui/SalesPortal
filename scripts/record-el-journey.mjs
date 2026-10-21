import { chromium } from "playwright";
import path from "path";
import os from "os";
import fs from "fs";

async function runAutomation() {
  console.log("🚀 Starting End-to-End EL Journey Recording Automation...");

  const workspaceDir = process.cwd();
  const tempDir = path.join(workspaceDir, "recordings", "temp_capture");
  const localVideoPath = path.join(workspaceDir, "recordings", "EL_Journey_Walkthrough.webm");
  const desktopVideoPath = path.join(os.homedir(), "Desktop", "EL_Journey_Walkthrough.webm");

  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: tempDir,
      size: { width: 1920, height: 1080 },
    },
  });

  // Pre-authenticate context directly as Priya Sharma (EL Agent) so recording starts cleanly at the EL Journey boundary
  await context.addInitScript(() => {
    const mockUser = {
      id: "EMP-SM-004",
      name: "Priya Sharma",
      role: "Senior Manager",
      email: "sm@nbfc.com",
      products: ["BL", "EL"],
    };
    localStorage.setItem("sales_token", "fake-jwt-token-priya");
    localStorage.setItem("sales_user", JSON.stringify(mockUser));
  });

  const page = await context.newPage();
  const pause = (ms = 1500) => page.waitForTimeout(ms);

  try {
    // ═══════════════════════════════════════════════════════════════
    // 1. Initial Load & Interactive Stepper Showcase
    // ═══════════════════════════════════════════════════════════════
    console.log("📌 Step 1: Navigating directly to EL Journey boundary...");
    await page.goto("http://localhost:3000/leads/el?mobile=9876543210&case=new", {
      waitUntil: "domcontentloaded",
    });

    console.log("⏳ Letting initial intro branding complete (3.8s)...");
    await pause(3800);

    console.log("✨ Hovering over stage stepper to showcase interactive icons & tooltips...");
    const stageItems = page.locator(".group.relative.select-none");
    const count = await stageItems.count();
    for (let i = 0; i < count; i++) {
      await stageItems.nth(i).hover();
      await pause(1000);
    }
    await page.mouse.move(500, 500);
    await pause(800);

    // ═══════════════════════════════════════════════════════════════
    // 2. Mobile Dedupe & Case Verification Branching
    // ═══════════════════════════════════════════════════════════════
    console.log("📌 Step 2: Testing Mobile Dedupe and Verification Branches...");
    const changeNumberBtn = page.locator('button:has-text("Change Number")');
    if (await changeNumberBtn.isVisible()) {
      await changeNumberBtn.click();
      await pause(1000);
    }

    const mobileInput = page.getByPlaceholder("Enter 10 digit mobile");
    await mobileInput.waitFor({ state: "visible", timeout: 5000 });
    await mobileInput.fill("9820012345");
    await pause(1000);

    const checkStatusBtn = page.locator('button:has-text("Check Status")');
    await checkStatusBtn.click();
    console.log("   -> Observing dedupe verification spinner...");
    await pause(2600); // 2s simulated check + buffer

    // Test WIP Case branch
    console.log("   -> Testing WIP Case branch...");
    const wipCaseBtn = page.locator('button:has-text("WIP Case")');
    if (await wipCaseBtn.isVisible()) {
      await wipCaseBtn.click();
      await pause(1800);
    }

    const tryAnotherBtn1 = page.locator('button:has-text("Try Another Number")');
    if (await tryAnotherBtn1.isVisible()) {
      await tryAnotherBtn1.click();
      await pause(1000);
    }

    // Test Rejected Case branch
    console.log("   -> Testing Rejected Case branch...");
    await mobileInput.fill("9820012345");
    await checkStatusBtn.click();
    await pause(2600);

    const rejectedCaseBtn = page.locator('button:has-text("Rejected Case")');
    if (await rejectedCaseBtn.isVisible()) {
      await rejectedCaseBtn.click();
      await pause(1800);
    }

    const tryAnotherBtn2 = page.locator('button:has-text("Try Another Number")');
    if (await tryAnotherBtn2.isVisible()) {
      await tryAnotherBtn2.click();
      await pause(1000);
    }

    // Test New Case branch
    console.log("   -> Proceeding with New Case...");
    await mobileInput.fill("9876543210");
    await checkStatusBtn.click();
    await pause(2600);

    const newCaseBtn = page.locator('button:has-text("New Case")');
    await newCaseBtn.click();
    await pause(1500);

    // ═══════════════════════════════════════════════════════════════
    // 3. Form Validations & Dynamic Recalculations
    // ═══════════════════════════════════════════════════════════════
    console.log("📌 Step 3: Testing Form Validations & Field Recalculations...");
    const nameInput = page.getByPlaceholder("Applicant full name");
    await nameInput.waitFor({ state: "visible", timeout: 5000 });
    await nameInput.fill(""); // Clear name to trigger validation
    await pause(1000);

    const submitBtn = page.locator('button:has-text("Save & Proceed to Consent")');
    await submitBtn.scrollIntoViewIfNeeded();
    await pause(1000);

    console.log("   -> Submitting with missing field to trigger inline validation error...");
    await submitBtn.click();
    await pause(2000);

    console.log("   -> Refilling applicant name...");
    await nameInput.fill("Aarav Sharma");
    await pause(1200);

    // Test Unserviceable PIN
    console.log("   -> Testing unserviceable PIN check (999999)...");
    const pinInput = page.getByPlaceholder("e.g. 560001, 400051");
    if (await pinInput.isVisible()) {
      await pinInput.scrollIntoViewIfNeeded();
      await pinInput.fill("999999");
      await pause(1800);

      console.log("   -> Restoring valid serviceable PIN (400001)...");
      await pinInput.fill("400001");
      await pause(1500);
    }

    // Test Employment Restriction (Self-employed)
    console.log("   -> Testing Self-employed policy restriction...");
    const selfEmployedLabel = page.getByLabel("Self-employed");
    if (await selfEmployedLabel.isVisible()) {
      await selfEmployedLabel.scrollIntoViewIfNeeded();
      await selfEmployedLabel.click();
      await pause(2000);

      console.log("   -> Switching back to eligible Salaried applicant...");
      const salariedLabel = page.getByLabel("Salaried");
      await salariedLabel.click();
      await pause(1500);
    }

    // Submit valid form to proceed -> triggers PFLStageLoader (3s) -> Stage 2
    console.log("   -> Submitting Stage 1 form to proceed to Stage 2...");
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();
    console.log("   -> PFLStageLoader active between Stage 1 and 2...");
    await pause(3600); // 3s loader + buffer

    // ═══════════════════════════════════════════════════════════════
    // 4. Stage 2 Digital Consent (Rejection & Approval Branches)
    // ═══════════════════════════════════════════════════════════════
    console.log("📌 Step 4: Testing Stage 2 Digital Consent...");
    const sendConsentBtn = page.locator('button:has-text("Send Consent Link")');
    await sendConsentBtn.waitFor({ state: "visible", timeout: 5000 });
    await sendConsentBtn.click();
    await pause(2000);

    // Rejection Simulation
    console.log("   -> Simulating customer consent rejection...");
    const simulateRejectBtn = page.locator('button:has-text("Simulate Reject")');
    if (await simulateRejectBtn.isVisible()) {
      await simulateRejectBtn.click();
      await pause(2000);

      // In rejected state, click Retry Consent
      const retryConsentBtn = page.locator('button:has-text("Retry Consent")');
      if (await retryConsentBtn.isVisible()) {
        await retryConsentBtn.click();
        await pause(1500);

        // Click Send Consent Link again
        await sendConsentBtn.click();
        await pause(1800);
      }
    }

    // Approval Simulation
    console.log("   -> Simulating customer consent approval...");
    const simulateApproveBtn = page.locator('button:has-text("Simulate Approve")');
    await simulateApproveBtn.waitFor({ state: "visible", timeout: 5000 });
    await simulateApproveBtn.click();
    await pause(1500);
    console.log("   -> PFLStageLoader active into Simulation Screen...");
    await pause(3600); // 3s loader + buffer

    // ═══════════════════════════════════════════════════════════════
    // 5. Route Simulation & Underwriting Path
    // ═══════════════════════════════════════════════════════════════
    console.log("📌 Step 5: Testing Route Simulation Screen...");
    const bankingTrackCard = page.locator('div:has-text("Final Offer (Banking)")').first();
    if (await bankingTrackCard.isVisible()) {
      await bankingTrackCard.click();
      await pause(1500);
    }

    const bureauTrackCard = page.locator('div:has-text("Final Offer (Bureau)")').first();
    if (await bureauTrackCard.isVisible()) {
      await bureauTrackCard.click();
      await pause(1500);
    }

    const proceedBtn = page.locator('button:has-text("Proceed to")').first();
    if (await proceedBtn.isVisible()) {
      await proceedBtn.click();
      console.log("   -> PFLStageLoader active into Stage 3...");
      await pause(3600);
    }

    // ═══════════════════════════════════════════════════════════════
    // 6. Stage 3 Employment Verification (All Methods & Breadcrumbs)
    // ═══════════════════════════════════════════════════════════════
    console.log("📌 Step 6: Testing Stage 3 Employment Verification...");
    const yesProceedOption = page.locator('div:has-text("Yes — Continue to Stage"), button:has-text("YES — Proceed")').first();
    if (await yesProceedOption.isVisible()) {
      await yesProceedOption.click();
      await pause(1800);
    }

    // Method A: Salary Slip Upload
    console.log("   -> Testing Method A: Salary Slip Upload simulation...");
    const uploadBtn = page.locator('button:has-text("Upload Recent Salary Slips")');
    if (await uploadBtn.isVisible()) {
      await uploadBtn.click();
      await pause(2200);

      const viewDocBtn = page.locator('button:has-text("View Document")').first();
      if (await viewDocBtn.isVisible()) {
        await viewDocBtn.click();
        await pause(2000);
        // Close modal
        const closeBtn = page.locator('button:has-text("Close Preview")');
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
          await pause(1000);
        }
      }
    }

    // Method B: UAN-Based Verification
    console.log("   -> Testing Method B: UAN Verification...");
    const uanTab = page.locator('button:has-text("UAN-Based Verification")');
    if (await uanTab.isVisible()) {
      await uanTab.click();
      await pause(1200);

      const uanInput = page.getByPlaceholder("Enter 12-digit UAN number");
      if (await uanInput.isVisible()) {
        await uanInput.fill("12345"); // invalid length
        const verifyUanBtn = page.locator('button:has-text("Verify UAN & Employer")');
        await verifyUanBtn.click();
        await pause(1500);

        await uanInput.fill("100928374651"); // valid 12-digit
        await verifyUanBtn.click();
        await pause(2000);
      }
    }

    // Method C: Official Work Email OTP
    console.log("   -> Testing Method C: Official Email OTP...");
    const emailTab = page.locator('button:has-text("Official Work Email OTP")');
    if (await emailTab.isVisible()) {
      await emailTab.click();
      await pause(1200);

      const sendLinkBtn = page.locator('button:has-text("Send Verification Link")');
      if (await sendLinkBtn.isVisible()) {
        await sendLinkBtn.click();
        await pause(1800);
      }

      const simFailBtn = page.locator('button:has-text("Simulate Failure")');
      if (await simFailBtn.isVisible()) {
        await simFailBtn.click();
        await pause(1800);
      }

      const simSuccessBtn = page.locator('button:has-text("Simulate Success")');
      if (await simSuccessBtn.isVisible()) {
        await simSuccessBtn.click();
        await pause(2000);
      }
    }

    // Breadcrumb Jump Navigation Demo
    console.log("   -> Demonstrating Stepper Breadcrumb Click Navigation...");
    const stageNodes = page.locator(".group.relative.select-none");
    if ((await stageNodes.count()) > 0) {
      await stageNodes.first().click(); // Stage 1 Details
      await pause(3600); // PFLStageLoader
      await pause(1500);

      // Jump back to Stage 3
      await stageNodes.nth(2).click(); // Stage 3 Employment Verify
      await pause(3600); // PFLStageLoader
      await pause(1500);
    }

    // Complete Employment Verification
    console.log("   -> Completing Employment Verification...");
    const completeEmpBtn = page.locator('button:has-text("Continue to Next Stage")');
    if (await completeEmpBtn.isVisible()) {
      await completeEmpBtn.click();
      console.log("   -> PFLStageLoader active into Stage 4 Final Offer...");
      await pause(3600);
    }

    // ═══════════════════════════════════════════════════════════════
    // 7. Stage 4 Final Offer (Bureau Track - ₹5,00,000)
    // ═══════════════════════════════════════════════════════════════
    console.log("📌 Step 7: Reviewing Final Offer (₹5,00,000)...");
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: "smooth" }));
    await pause(1800);

    const selectOfferBtn = page.locator('button:has-text("Select Offer & Send DIY Journey Link")');
    await selectOfferBtn.scrollIntoViewIfNeeded();
    await pause(1200);
    await selectOfferBtn.click();
    console.log("   -> PFLStageLoader active into Stage 5 Timeline...");
    await pause(3600);

    // ═══════════════════════════════════════════════════════════════
    // 8. Stage 5 Customer Timeline & Milestones
    // ═══════════════════════════════════════════════════════════════
    console.log("📌 Step 8: Testing Customer Timeline Milestones...");
    
    // Send Final Offer Link
    console.log("   -> Sending Final Offer Link to customer...");
    const sendLinkTimelineBtn = page.locator('button:has-text("Send Link")');
    if (await sendLinkTimelineBtn.isVisible()) {
      await sendLinkTimelineBtn.click();
      await pause(1500);
    }

    // Toggle a milestone tile manually
    console.log("   -> Toggling individual milestone step...");
    const firstStepTile = page.locator('div:has-text("Final Offer Summary")').last();
    if (await firstStepTile.isVisible()) {
      await firstStepTile.click();
      await pause(1200);
    }

    // Auto-complete all remaining milestones
    console.log("   -> Auto-completing all timeline milestones...");
    const completeAllBtn = page.locator('button:has-text("Complete All")');
    if (await completeAllBtn.isVisible()) {
      await completeAllBtn.click();
      await pause(1500);
    }

    // Complete Application -> Confetti -> Stage 6
    console.log("   -> Completing Customer Journey (Confetti Celebration)...");
    const completeAppBtn = page.locator('button:has-text("Complete Application")');
    if (await completeAppBtn.isVisible()) {
      await completeAppBtn.click();
      await pause(2000);
      console.log("   -> PFLStageLoader active into Stage 6 Disbursement...");
      await pause(3600);
    }

    // ═══════════════════════════════════════════════════════════════
    // 9. Stage 6 Loan Disbursement
    // ═══════════════════════════════════════════════════════════════
    console.log("📌 Step 9: Processing Final Loan Disbursement...");
    await pause(2000);

    const fastForwardBtn = page.locator('button:has-text("Fast-Forward")');
    if (await fastForwardBtn.isVisible()) {
      await fastForwardBtn.click();
      await pause(3000);
    }

    // Test Copy button on UTR Reference
    console.log("   -> Testing UTR Copy button...");
    const copyBtn = page.locator("button.hover\\:text-emerald-200").first();
    if (await copyBtn.isVisible()) {
      await copyBtn.click();
      await pause(1200);
    }
    await pause(2000);

    // ═══════════════════════════════════════════════════════════════
    // 10. Alternative Pathway Demo — Banking Track (₹15,00,000)
    // ═══════════════════════════════════════════════════════════════
    console.log("📌 Step 10: Demonstrating Alternative Banking Track (₹15,00,000)...");
    const routeChangeBtn = page.locator('button:has-text("(Change)")');
    if (await routeChangeBtn.isVisible()) {
      await routeChangeBtn.click();
      console.log("   -> PFLStageLoader into Simulation Screen...");
      await pause(3600);

      // Select Banking Track & Express Policy
      const bankingCard = page.locator('div:has-text("Final Offer (Banking)")').first();
      if (await bankingCard.isVisible()) {
        await bankingCard.click();
        await pause(1500);
      }

      const skipEmpBtn = page.locator('div:has-text("NO — Skip Employment Verification")').first();
      if (await skipEmpBtn.isVisible()) {
        await skipEmpBtn.click();
        await pause(1500);
      }

      const proceedBankBtn = page.locator('button:has-text("Proceed to Bank Verification")');
      if (await proceedBankBtn.isVisible()) {
        await proceedBankBtn.click();
        console.log("   -> PFLStageLoader into Banking Verification...");
        await pause(3600);
      }

      // Stage Banking Verification
      console.log("   -> Testing Account Aggregator Banking Verification...");
      const sendAaLinkBtn = page.locator('button:has-text("Send Link to Customer")');
      if (await sendAaLinkBtn.isVisible()) {
        await sendAaLinkBtn.click();
        await pause(1800);
      }

      const customerAuthBtn = page.locator('button:has-text("Customer Has Authorised → Verify Statements")');
      if (await customerAuthBtn.isVisible()) {
        await customerAuthBtn.click();
        await pause(1800);
      }

      // Test Timeout Error simulation
      console.log("   -> Simulating AA Timeout Error...");
      const simTimeoutBtn = page.locator('button:has-text("Timeout Error")');
      if (await simTimeoutBtn.isVisible()) {
        await simTimeoutBtn.click();
        await pause(1800);

        const retryBvBtn = page.locator('button:has-text("Retry Banking Verification")');
        if (await retryBvBtn.isVisible()) {
          await retryBvBtn.click();
          await pause(1800);
        }
      }

      // Simulate Success
      console.log("   -> Simulating AA Verification Success...");
      const simAaSuccess = page.locator('button:has-text("Success")');
      if (await simAaSuccess.isVisible()) {
        await simAaSuccess.click();
        await pause(2500);
      }

      const proceedOffer15 = page.locator('button:has-text("Proceed to Banking Offer")');
      if (await proceedOffer15.isVisible()) {
        await proceedOffer15.click();
        console.log("   -> PFLStageLoader into Banking Final Offer...");
        await pause(3600);
      }

      // Final Offer Banking (₹15L)
      console.log("   -> Reviewing Final Offer (₹15,00,000)...");
      const acceptOffer15 = page.locator('button:has-text("Select Offer & Send DIY Journey Link")');
      if (await acceptOffer15.isVisible()) {
        await acceptOffer15.scrollIntoViewIfNeeded();
        await pause(1500);
        await acceptOffer15.click();
        console.log("   -> PFLStageLoader into Timeline...");
        await pause(3600);
      }

      // Timeline & Final Disbursement for Banking Track
      const completeAll2 = page.locator('button:has-text("Complete All")');
      if (await completeAll2.isVisible()) {
        await completeAll2.click();
        await pause(1500);
      }

      const finishJourney2 = page.locator('button:has-text("Complete Application")');
      if (await finishJourney2.isVisible()) {
        await finishJourney2.click();
        await pause(2000);
        console.log("   -> PFLStageLoader into Final Disbursement...");
        await pause(3600);
      }

      const ff2 = page.locator('button:has-text("Fast-Forward")');
      if (await ff2.isVisible()) {
        await ff2.click();
        await pause(3000);
      }
    }

    console.log("🎉 All paths, branches, and interactions recorded successfully!");
    await pause(2500);
  } catch (error) {
    console.error("❌ Automation encountered an error:", error);
  } finally {
    console.log("🎬 Closing browser context and flushing video buffer...");
    await page.close();
    await context.close();
    await browser.close();

    // Move generated video to Desktop and local recordings
    const videoFiles = fs.readdirSync(tempDir).filter((f) => f.endsWith(".webm"));
    if (videoFiles.length > 0) {
      const generatedVideo = path.join(tempDir, videoFiles[0]);
      fs.copyFileSync(generatedVideo, localVideoPath);
      try {
        fs.copyFileSync(generatedVideo, desktopVideoPath);
        console.log(`✅ Recording saved to Desktop: ${desktopVideoPath}`);
      } catch (err) {
        console.warn(`⚠️ Could not write directly to Desktop: ${err.message}`);
      }
      fs.rmSync(tempDir, { recursive: true, force: true });
      const stats = fs.statSync(localVideoPath);
      console.log(`✅ Recording saved locally: ${localVideoPath}`);
      console.log(`📊 File Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    } else {
      console.error("⚠️ No video file found in temp directory!");
    }
  }
}

runAutomation();

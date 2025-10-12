-- CreateIndex
CREATE INDEX "Project_id_ownerId_idx" ON "Project"("id", "ownerId");

-- CreateIndex
CREATE INDEX "ProjectMember_projectId_userId_idx" ON "ProjectMember"("projectId", "userId");

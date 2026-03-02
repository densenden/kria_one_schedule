-- ============================================================================
-- Row Level Security Policies for Multi-Tenant Architecture
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TENANT ISOLATION HELPERS
-- ============================================================================

-- Function to get current tenant from JWT or session
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    -- Try to get from app setting (set by middleware)
    RETURN NULLIF(current_setting('app.current_tenant_id', true), '')::UUID;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's role in current tenant
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
DECLARE
    v_role TEXT;
BEGIN
    SELECT role INTO v_role
    FROM public.users
    WHERE clerk_user_id = current_setting('app.current_user_id', true)
      AND tenant_id = get_current_tenant_id();
    RETURN v_role;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is admin/owner
CREATE OR REPLACE FUNCTION is_tenant_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_current_user_role() IN ('admin', 'owner');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TENANTS POLICIES
-- ============================================================================

-- Anyone can view tenants (for subdomain resolution)
CREATE POLICY "tenants_select_public" ON public.tenants
    FOR SELECT USING (true);

-- Only service role can insert/update/delete tenants
CREATE POLICY "tenants_admin_all" ON public.tenants
    FOR ALL USING (false);

-- ============================================================================
-- USERS POLICIES
-- ============================================================================

-- Users can view other public users in same tenant
CREATE POLICY "users_select_same_tenant" ON public.users
    FOR SELECT USING (
        tenant_id = get_current_tenant_id()
        AND (is_public = true OR id = current_setting('app.current_user_id', true))
    );

-- Users can update their own profile
CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (
        clerk_user_id = current_setting('app.current_user_id', true)
    );

-- Admins can manage all users in their tenant
CREATE POLICY "users_admin_all" ON public.users
    FOR ALL USING (
        tenant_id = get_current_tenant_id()
        AND is_tenant_admin()
    );

-- ============================================================================
-- COURSES POLICIES
-- ============================================================================

-- Anyone can view active courses in tenant
CREATE POLICY "courses_select_active" ON public.courses
    FOR SELECT USING (
        tenant_id = get_current_tenant_id()
        AND (is_active = true OR is_tenant_admin())
    );

-- Only admins can manage courses
CREATE POLICY "courses_admin_all" ON public.courses
    FOR ALL USING (
        tenant_id = get_current_tenant_id()
        AND is_tenant_admin()
    );

-- ============================================================================
-- SCHEDULES POLICIES
-- ============================================================================

-- Anyone can view non-cancelled schedules
CREATE POLICY "schedules_select_public" ON public.schedules
    FOR SELECT USING (
        tenant_id = get_current_tenant_id()
    );

-- Only admins can manage schedules
CREATE POLICY "schedules_admin_all" ON public.schedules
    FOR ALL USING (
        tenant_id = get_current_tenant_id()
        AND is_tenant_admin()
    );

-- ============================================================================
-- BOOKINGS POLICIES
-- ============================================================================

-- Users can view their own bookings
CREATE POLICY "bookings_select_own" ON public.bookings
    FOR SELECT USING (
        tenant_id = get_current_tenant_id()
        AND user_id = current_setting('app.current_user_id', true)
    );

-- Users can create their own bookings
CREATE POLICY "bookings_insert_own" ON public.bookings
    FOR INSERT WITH CHECK (
        tenant_id = get_current_tenant_id()
        AND user_id = current_setting('app.current_user_id', true)
    );

-- Users can update their own bookings (cancel)
CREATE POLICY "bookings_update_own" ON public.bookings
    FOR UPDATE USING (
        tenant_id = get_current_tenant_id()
        AND user_id = current_setting('app.current_user_id', true)
    );

-- Admins can view all bookings in tenant
CREATE POLICY "bookings_admin_select" ON public.bookings
    FOR SELECT USING (
        tenant_id = get_current_tenant_id()
        AND is_tenant_admin()
    );

-- Admins can manage all bookings
CREATE POLICY "bookings_admin_all" ON public.bookings
    FOR ALL USING (
        tenant_id = get_current_tenant_id()
        AND is_tenant_admin()
    );

-- ============================================================================
-- PAGES POLICIES
-- ============================================================================

-- Anyone can view published pages
CREATE POLICY "pages_select_published" ON public.pages
    FOR SELECT USING (
        tenant_id = get_current_tenant_id()
        AND (is_published = true OR is_tenant_admin())
    );

-- Only admins can manage pages
CREATE POLICY "pages_admin_all" ON public.pages
    FOR ALL USING (
        tenant_id = get_current_tenant_id()
        AND is_tenant_admin()
    );

-- ============================================================================
-- WAITLIST POLICIES
-- ============================================================================

-- Users can view their own waitlist entries
CREATE POLICY "waitlist_select_own" ON public.waitlist
    FOR SELECT USING (
        tenant_id = get_current_tenant_id()
        AND user_id = current_setting('app.current_user_id', true)
    );

-- Users can join waitlist
CREATE POLICY "waitlist_insert_own" ON public.waitlist
    FOR INSERT WITH CHECK (
        tenant_id = get_current_tenant_id()
        AND user_id = current_setting('app.current_user_id', true)
    );

-- Users can remove themselves from waitlist
CREATE POLICY "waitlist_delete_own" ON public.waitlist
    FOR DELETE USING (
        tenant_id = get_current_tenant_id()
        AND user_id = current_setting('app.current_user_id', true)
    );

-- Admins can manage waitlist
CREATE POLICY "waitlist_admin_all" ON public.waitlist
    FOR ALL USING (
        tenant_id = get_current_tenant_id()
        AND is_tenant_admin()
    );

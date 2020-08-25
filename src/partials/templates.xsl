<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="teams">
	<xsl:for-each select="./Team">
		<div class="team">
			<xsl:attribute name="data-name"><xsl:value-of select="@short"/></xsl:attribute>
		</div>
	</xsl:for-each>
</xsl:template>

<xsl:template name="channels">
	<h2><i class="icon-chevron-left"></i>Channels</h2>
	
	<xsl:for-each select="./Channels/*">
		<div class="channel">
			<i class="icon-thread"></i>
			<div class="name">
				<xsl:value-of select="@name"/>
			</div>
		</div>
	</xsl:for-each>

	<div class="add-channel">
		<i class="icon-plus"></i>Add a channel
	</div>
</xsl:template>

<xsl:template name="members">
	<h2><i class="icon-chevron-left"></i>Members</h2>

	<xsl:for-each select="./Members/*">
		<xsl:variable name="user" select="//Contacts/i[@id = current()/@id]"/>
		<div class="member">
			<xsl:if test="$user/@online = 1">
				<xsl:attribute name="class">member online</xsl:attribute>
			</xsl:if>
			<i class="icon-offline"></i>
			<div class="name">
				<xsl:value-of select="$user/@name"/>
			</div>
		</div>
	</xsl:for-each>

	<div class="add-member">
		<i class="icon-plus"></i>Invite people
	</div>
</xsl:template>

<xsl:template name="transcripts">
	<xsl:variable name="me" select="//Contacts/i[@me = 'true']"/>
	<xsl:for-each select="./*">
		<xsl:variable name="user" select="//Contacts/i[@id = current()/@from]"/>
		<div>
			<xsl:attribute name="class">message <xsl:choose>
				<xsl:when test="@from = $me/@id">sent</xsl:when>
				<xsl:otherwise>received</xsl:otherwise>
			</xsl:choose></xsl:attribute>
			<div class="avatar">
				<xsl:attribute name="data-name"><xsl:value-of select="$user/@short"/></xsl:attribute>
			</div>
			<div class="date"><xsl:value-of select="@timestamp"/></div>
			<xsl:value-of select="." disable-output-escaping="yes"/>
		</div>
	</xsl:for-each>
</xsl:template>

<xsl:template name="info">
	<div class="info-body">
		<div class="profile">
			<div class="avatar" style="background-image: url(~/img/hbi.jpg);"></div>
			<h2>Hakan Bilgin</h2>
		</div>

		<div class="field">
			<span>Nickname</span>
			<span>hbi</span>
		</div>

		<div class="field">
			<span>Phone</span>
			<span>+46(8) 622 07 07</span>
		</div>
	</div>
</xsl:template>

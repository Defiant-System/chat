<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="teams">
	<xsl:for-each select="./Team">
		<div class="team">
			<xsl:if test="not(@img)">
				<xsl:attribute name="data-name"><xsl:value-of select="@short"/></xsl:attribute>
			</xsl:if>
			<xsl:if test="@img">
				<xsl:attribute name="style">
					background-image: url(<xsl:value-of select="@img"/>);
					background-color: transparent;
				</xsl:attribute>
			</xsl:if>
		</div>
	</xsl:for-each>
</xsl:template>

<xsl:template name="channels">
	<h2 data-click="toggle-channels"><i class="icon-chevron-left"></i>Channels</h2>
	
	<div class="channels-list"><ul>
		<xsl:for-each select="./Channels/*">
			<li class="channel" data-click="select-thread">
				<xsl:if test="position() = 1">
					<xsl:attribute name="class">channel active</xsl:attribute>
				</xsl:if>
				<i class="icon-thread"></i>
				<div class="name">
					<xsl:value-of select="@name"/>
				</div>
			</li>
		</xsl:for-each>
		<li class="add-channel" data-click="add-channel">
			<i class="icon-plus"></i>Add a channel
		</li>
	</ul></div>
</xsl:template>

<xsl:template name="members">
	<h2 data-click="toggle-members"><i class="icon-chevron-left"></i>Members</h2>

	<div class="members-list"><ul>
		<xsl:for-each select="./Members/*">
			<xsl:variable name="user" select="//Contacts/i[@id = current()/@id]"/>
			<li class="member" data-click="select-thread">
				<xsl:if test="$user/@online = 1">
					<xsl:attribute name="class">member online</xsl:attribute>
				</xsl:if>
				<i class="icon-offline"></i>
				<div class="name">
					<xsl:value-of select="$user/@name"/>
				</div>
			</li>
		</xsl:for-each>
		<li class="add-member" data-click="add-member">
			<i class="icon-plus"></i>Invite people
		</li>
	</ul></div>
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
